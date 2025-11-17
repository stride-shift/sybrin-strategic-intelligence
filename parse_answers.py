#!/usr/bin/env python3
"""
Parse Strategic Intelligence Q&A files into structured JSON
"""

import json
import os
import re
from pathlib import Path

# Category mapping based on filename patterns and problem statement structure
CATEGORIES = {
    "Market_Understanding_and_Decision_Makers": {
        "id": "market-understanding",
        "name": "Market Understanding & Decision Makers",
        "icon": "Users",
        "color": "blue",
        "description": "Understanding demand, segments, decision-makers, and cultural dynamics"
    },
    "Competitive_Landscape_and_Pricing": {
        "id": "competitive-pricing",
        "name": "Competitive Landscape & Pricing",
        "icon": "DollarSign",
        "color": "orange",
        "description": "Pricing strategies, competitive positioning, and value propositions"
    },
    "Regulatory_and_Compliance": {
        "id": "regulatory",
        "name": "Regulatory & Compliance",
        "icon": "Shield",
        "color": "purple",
        "description": "Compliance requirements, regulatory environment, and industry associations"
    },
    "Partnerships_and_Ecosystem_Fit": {
        "id": "partnerships",
        "name": "Partnerships & Ecosystem Fit",
        "icon": "Handshake",
        "color": "green",
        "description": "Partner strategies, reseller models, and ecosystem positioning"
    },
    "Product_Modernization_and_Differentiation": {
        "id": "product",
        "name": "Product Modernization & Differentiation",
        "icon": "Lightbulb",
        "color": "indigo",
        "description": "Product consolidation, differentiation, and modernization strategies"
    },
    "Sales_Execution_and_Outreach": {
        "id": "sales",
        "name": "Sales Execution & Outreach",
        "icon": "Target",
        "color": "yellow",
        "description": "Sales strategies, trust-building, and market positioning"
    },
    "Geography-Specific_Strategy": {
        "id": "geography",
        "name": "Geography-Specific Strategy",
        "icon": "Globe",
        "color": "red",
        "description": "Market-specific strategies for South Africa, Africa, and Philippines"
    }
}

def extract_nutshell(content):
    """Extract the 'In a nutshell' section"""
    # Try standard format first
    match = re.search(r'## In a nutshell\s*\n+(.*?)\n+---', content, re.DOTALL)
    if match:
        return match.group(1).strip()

    # Try inline format (like in overview file) - handle both plain and bold headers
    match = re.search(r'(?:\*\*)?In a nutshell:?\s*(?:\*\*)?\s*\n+(.*?)(?=\n+---|\n+##|$)', content, re.IGNORECASE | re.DOTALL)
    if match:
        text = match.group(1).strip()
        # Remove leading ** if present (from broken extraction)
        text = re.sub(r'^\*\*\s+', '', text)
        return text

    return ""

def extract_question(content):
    """Extract the question text"""
    match = re.search(r'## Question\s*\n+(.*?)\n+---', content, re.DOTALL)
    if match:
        return match.group(1).strip()
    return ""

def has_timeframe_sections(content):
    """Check if content has distinct 18-month and longer-term sections"""
    has_18month = bool(re.search(r'###?\s+18.month', content, re.IGNORECASE))
    has_longterm = bool(re.search(r'###?\s+Longer.term', content, re.IGNORECASE))
    return has_18month and has_longterm

def extract_section_content(content, section_pattern, end_patterns):
    """Extract content between a section header and the next major section"""
    match = re.search(section_pattern, content, re.IGNORECASE)
    if not match:
        return ""

    start_pos = match.end()

    # Find the end position (next major section or end of content)
    end_pos = len(content)
    for end_pattern in end_patterns:
        end_match = re.search(end_pattern, content[start_pos:], re.IGNORECASE)
        if end_match:
            end_pos = min(end_pos, start_pos + end_match.start())

    return content[start_pos:end_pos].strip()

def extract_key_insights(section_text, max_bullets=5):
    """Extract key bullet points from a section as insights"""
    if not section_text or len(section_text) < 50:
        return []

    # Look for bullet points (-, •, or numbered lists)
    bullets = re.findall(r'(?:^|\n)\s*[-•]\s*([^\n]+)', section_text)

    if not bullets:
        # Try numbered lists
        bullets = re.findall(r'(?:^|\n)\s*\d+\.\s*([^\n]+)', section_text)

    if not bullets:
        # Try bold statements as insights
        bullets = re.findall(r'\*\*([^*]+)\*\*', section_text)

    # Clean and deduplicate
    insights = []
    seen = set()
    for bullet in bullets:
        clean = bullet.strip()
        # Skip very short bullets
        if len(clean) < 20 or clean.lower() in seen:
            continue
        seen.add(clean.lower())
        insights.append(clean)
        if len(insights) >= max_bullets:
            break

    return insights

def clean_content(content):
    """Remove metadata footer from content"""
    # Remove lines like: *Generated: 2025-11-16 19:59:12*
    # and: *Model: gpt-5.1 with File Search*
    content = re.sub(r'\n---\s*\n\*Generated:.*?\*\s*\n\*Model:.*?\*\s*$', '', content, flags=re.DOTALL)
    content = re.sub(r'\n\*Generated:.*?\*\s*\n\*Model:.*?\*\s*$', '', content, flags=re.DOTALL)
    return content.strip()

def split_timeframes(content):
    """Split content into 18-month and long-term sections - just include everything after ## Answer"""
    # Get everything after "## Answer"
    answer_match = re.search(r'## Answer\s*\n+(.*)', content, re.DOTALL)
    if not answer_match:
        return "", ""

    full_answer = answer_match.group(1).strip()

    # Clean metadata footer
    full_answer = clean_content(full_answer)

    # For now, just return the full answer for both timeframes
    # The UI will handle displaying the appropriate sections
    return full_answer, full_answer

def parse_file(filepath):
    """Parse a single answer file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    filename = os.path.basename(filepath)

    # Extract question number and category from filename
    match = re.match(r'(\d+)_(.+)\.md', filename)
    if not match:
        return None

    question_num = match.group(1)
    category_key = match.group(2)

    # Special handling for file 00 (overview)
    if question_num == "00":
        return {
            "type": "overview",
            "title": "Geography Opportunity Ranking",
            "question": extract_question(content),
            "nutshell": extract_nutshell(content),
            "fullContent": content
        }

    # Regular question file
    question_text = extract_question(content)
    nutshell = extract_nutshell(content)
    short_term_content, long_term_content = split_timeframes(content)

    # Extract insights based on whether file has distinct timeframe sections
    short_term_insights = []
    long_term_insights = []
    general_insights = []

    if has_timeframe_sections(content):
        # Extract content from specific timeframe sections
        short_section = extract_section_content(
            content,
            r'###?\s+18.month',
            [r'\n###?\s+Longer.term', r'\n##\s+\d+\.', r'\n---']
        )
        long_section = extract_section_content(
            content,
            r'###?\s+Longer.term',
            [r'\n##\s+\d+\.', r'\n---']
        )

        if short_section:
            short_term_insights = extract_key_insights(short_section)
        if long_section:
            long_term_insights = extract_key_insights(long_section)
    else:
        # Extract general insights from the full answer
        general_insights = extract_key_insights(short_term_content, max_bullets=6)

    return {
        "id": int(question_num),
        "question": question_text,
        "nutshell": nutshell,
        "category": category_key,
        "shortTerm": {
            "keyInsights": short_term_insights,
            "fullContent": short_term_content
        },
        "longTerm": {
            "keyInsights": long_term_insights,
            "fullContent": long_term_content
        },
        "generalInsights": general_insights,
        "fullContent": content
    }

def main():
    answers_dir = Path("/Users/justin/Projects/Sybrin Problem Statements/gpt_5_only_answers")
    output_file = Path("/Users/justin/Projects/Sybrin Problem Statements/Frontend/regulatory-dashboard/src/data/strategic-intelligence.json")

    # Ensure output directory exists
    output_file.parent.mkdir(parents=True, exist_ok=True)

    # Parse all files
    overview = None
    questions_by_category = {}

    for filepath in sorted(answers_dir.glob("*.md")):
        parsed = parse_file(filepath)
        if not parsed:
            continue

        if parsed.get("type") == "overview":
            overview = parsed
        else:
            category_key = parsed["category"]
            if category_key not in questions_by_category:
                questions_by_category[category_key] = []
            questions_by_category[category_key].append(parsed)

    # Build final structure
    categories = []
    for category_key, category_info in CATEGORIES.items():
        questions = questions_by_category.get(category_key, [])
        if questions:
            categories.append({
                **category_info,
                "questions": sorted(questions, key=lambda q: q["id"])
            })

    result = {
        "overview": overview,
        "categories": categories,
        "metadata": {
            "totalQuestions": sum(len(c["questions"]) for c in categories),
            "totalCategories": len(categories),
            "lastUpdated": "2025-11-17"
        }
    }

    # Write JSON
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    print(f"✓ Parsed {result['metadata']['totalQuestions']} questions across {result['metadata']['totalCategories']} categories")
    print(f"✓ Output written to: {output_file}")

    # Print summary
    print("\nCategories:")
    for cat in categories:
        print(f"  - {cat['name']}: {len(cat['questions'])} questions")

if __name__ == "__main__":
    main()
