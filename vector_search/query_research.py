#!/usr/bin/env python3
"""
Query interface for Sybrin Research Assistant
Uses OpenAI Responses API with File Search (gpt-5.1)
"""

import os
import sys
import json
import time
from pathlib import Path
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Configuration
CONFIG_FILE = Path(__file__).parent / "assistant_config.json"

def load_config():
    """Load assistant configuration"""
    if not CONFIG_FILE.exists():
        print("❌ No configuration found. Please run setup_file_search.py first.")
        sys.exit(1)

    with open(CONFIG_FILE, 'r') as f:
        return json.load(f)

def query_assistant(question, vector_store_id, previous_response_id=None, show_sources=True):
    """
    Ask a question to the research assistant using Responses API

    Args:
        question: The question to ask
        vector_store_id: OpenAI vector store ID containing research documents
        previous_response_id: Optional previous response ID for conversation continuity
        show_sources: Whether to show source citations

    Returns:
        dict with answer, citations, and response_id
    """
    print(f"\n💭 Question: {question}")
    print("🔍 Searching research documents...\n")

    try:
        # Create response using Responses API
        response = client.responses.create(
            model="gpt-5.1",
            input=question,
            tools=[{
                "type": "file_search",
                "vector_store_ids": [vector_store_id]
            }],
            previous_response_id=previous_response_id,
            store=True  # Keep conversation state for follow-ups
        )

        # Extract text output
        response_text = ""
        citations = []

        # Parse output
        if hasattr(response, 'output_text'):
            response_text = response.output_text
        elif hasattr(response, 'output') and response.output:
            # Extract text from output array
            for output_item in response.output:
                if hasattr(output_item, 'type') and output_item.type == 'text':
                    response_text += output_item.text
                # Extract citations from file_search tool calls
                elif hasattr(output_item, 'type') and output_item.type == 'file_search_call':
                    if hasattr(output_item, 'results'):
                        for result in output_item.results:
                            citations.append({
                                'file_id': result.file_id if hasattr(result, 'file_id') else 'unknown',
                                'content': result.content[:200] if hasattr(result, 'content') else ''
                            })

        print("="*70)
        print("📝 Answer:")
        print("="*70)
        print(response_text)
        print()

        # Show citations
        if show_sources and citations:
            print("="*70)
            print("📚 Sources:")
            print("="*70)
            for i, citation in enumerate(citations, 1):
                print(f"{i}. File ID: {citation.get('file_id', 'unknown')}")
                if citation.get('content'):
                    print(f"   Excerpt: {citation['content'][:150]}...")
                print()

        return {
            "answer": response_text,
            "citations": citations,
            "response_id": response.id,
            "status": response.status
        }

    except Exception as e:
        print(f"❌ Query failed with error: {e}")
        return None

def interactive_mode(vector_store_id):
    """Interactive query mode with conversation continuity"""
    print("\n" + "="*70)
    print("🤖 Sybrin Research Assistant - Interactive Mode (Responses API)")
    print("="*70)
    print("\nUsing: gpt-5.1 model with File Search")
    print("\nType your questions below. Commands:")
    print("  - 'quit' or 'exit' to stop")
    print("  - 'help' for example questions")
    print("  - 'new' to start a new conversation")
    print("="*70 + "\n")

    previous_response_id = None

    while True:
        try:
            question = input("❓ Your question: ").strip()

            if not question:
                continue

            if question.lower() in ['quit', 'exit', 'q']:
                print("\n👋 Goodbye!")
                break

            if question.lower() == 'new':
                previous_response_id = None
                print("\n✨ Started new conversation\n")
                continue

            if question.lower() == 'help':
                show_help()
                continue

            # Query with conversation continuity
            result = query_assistant(
                question,
                vector_store_id,
                previous_response_id=previous_response_id
            )

            if result:
                # Track response ID for follow-up questions
                previous_response_id = result.get('response_id')

            print("\n" + "-"*70 + "\n")

        except KeyboardInterrupt:
            print("\n\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"\n❌ Error: {e}\n")

def show_help():
    """Show example questions"""
    print("\n" + "="*70)
    print("💡 Example Questions:")
    print("="*70)
    examples = [
        "Compare regulatory costs between Kenya and Tanzania",
        "What are the main market entry barriers in South Africa?",
        "Summarize customer pain points across East African markets",
        "What compliance requirements exist for fintech in Nigeria?",
        "Compare competitive landscapes in Ghana vs Kenya",
        "What are the key decision-maker profiles in Ethiopian banks?",
        "Rank African markets by ease of market entry",
        "What cultural considerations are important for sales in Uganda?",
        "List top 5 competitors in the South African fintech space",
        "What are common regulatory challenges across all markets?",
    ]
    for i, example in enumerate(examples, 1):
        print(f"{i:2}. {example}")
    print("="*70 + "\n")

def main():
    """Main entry point"""
    # Load configuration
    config = load_config()
    vector_store_id = config.get('vector_store_id')

    print("="*70)
    print("🚀 Sybrin Research Assistant (Responses API)")
    print("="*70)
    print(f"Model: gpt-5.1")
    print(f"Vector Store ID: {vector_store_id}")
    print(f"Total files indexed: {config.get('total_files', 'unknown')}")
    print(f"Created: {config.get('created_at', 'unknown')}")
    print("="*70)

    # Check for command line argument
    if len(sys.argv) > 1:
        # Single query mode
        question = ' '.join(sys.argv[1:])
        query_assistant(question, vector_store_id)
    else:
        # Interactive mode
        interactive_mode(vector_store_id)

if __name__ == "__main__":
    main()
