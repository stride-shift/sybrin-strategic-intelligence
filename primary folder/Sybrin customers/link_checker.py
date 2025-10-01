#!/usr/bin/env python3
"""
Link Checker for Sybrin Customer List Document
Verifies all URLs in the markdown document are valid and accessible
"""

import re
import requests
from urllib.parse import urlparse
import time
from typing import List, Tuple, Dict
import sys
from datetime import datetime
import concurrent.futures
import threading

class LinkChecker:
    def __init__(self, timeout: int = 10):
        self.timeout = timeout
        self.results = []
        self.lock = threading.Lock()
        
    def extract_links_from_markdown(self, filepath: str) -> List[Tuple[str, str]]:
        """Extract all URLs from markdown file with their context"""
        links = []
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Find markdown links [text](url)
            markdown_pattern = r'\[([^\]]+)\]\(([^)]+)\)'
            for match in re.finditer(markdown_pattern, content):
                text, url = match.groups()
                if url.startswith('http'):
                    links.append((text, url))
            
            # Find bare URLs
            bare_url_pattern = r'https?://[^\s<>"{}|\\^`\[\]]*'
            for match in re.finditer(bare_url_pattern, content):
                url = match.group()
                # Clean up URL (remove trailing punctuation)
                url = re.sub(r'[,.:;!?]+$', '', url)
                if url not in [u for _, u in links]:
                    links.append(("Bare URL", url))
                    
        except FileNotFoundError:
            print(f"Error: File {filepath} not found")
            sys.exit(1)
            
        return links
    
    def check_link(self, text: str, url: str) -> Dict:
        """Check if a single link is accessible"""
        result = {
            'text': text,
            'url': url,
            'status': 'Unknown',
            'status_code': None,
            'error': None,
            'redirect': None
        }
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        try:
            response = requests.get(
                url, 
                headers=headers, 
                timeout=self.timeout,
                allow_redirects=True,
                verify=True
            )
            
            result['status_code'] = response.status_code
            
            if response.status_code == 200:
                result['status'] = '✅ OK'
            elif 300 <= response.status_code < 400:
                result['status'] = '↪️ Redirect'
                result['redirect'] = response.url
            elif response.status_code == 404:
                result['status'] = '❌ Not Found'
            elif 400 <= response.status_code < 500:
                result['status'] = f'⚠️ Client Error'
            elif 500 <= response.status_code < 600:
                result['status'] = '🔥 Server Error'
            else:
                result['status'] = f'❓ Unusual ({response.status_code})'
                
            # Check if we were redirected
            if response.history and response.url != url:
                result['redirect'] = response.url
                
        except requests.exceptions.Timeout:
            result['status'] = '⏱️ Timeout'
            result['error'] = 'Connection timed out'
        except requests.exceptions.ConnectionError:
            result['status'] = '🔌 Connection Error'
            result['error'] = 'Failed to connect'
        except requests.exceptions.SSLError:
            result['status'] = '🔒 SSL Error'
            result['error'] = 'SSL certificate verification failed'
        except requests.exceptions.RequestException as e:
            result['status'] = '❗ Error'
            result['error'] = str(e)
            
        return result
    
    def check_links_parallel(self, links: List[Tuple[str, str]], max_workers: int = 10) -> List[Dict]:
        """Check multiple links in parallel"""
        print(f"\n🔍 Checking {len(links)} links with {max_workers} workers...\n")
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
            # Submit all tasks
            future_to_link = {
                executor.submit(self.check_link, text, url): (text, url) 
                for text, url in links
            }
            
            # Process results as they complete
            for i, future in enumerate(concurrent.futures.as_completed(future_to_link), 1):
                result = future.result()
                with self.lock:
                    self.results.append(result)
                    
                # Print progress
                status_symbol = result['status'].split()[0]
                print(f"{i:3}/{len(links)} {status_symbol} {result['url'][:80]}...")
                
        return self.results
    
    def print_report(self, results: List[Dict]):
        """Print a formatted report of results"""
        print("\n" + "="*80)
        print("LINK CHECK REPORT")
        print("="*80)
        print(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"Total links checked: {len(results)}")
        
        # Categorize results
        ok_links = [r for r in results if '✅' in r['status']]
        redirect_links = [r for r in results if '↪️' in r['status']]
        error_links = [r for r in results if r['status_code'] is None or (r['status_code'] and r['status_code'] >= 400)]
        
        print(f"\n✅ Working: {len(ok_links)}")
        print(f"↪️ Redirects: {len(redirect_links)}")
        print(f"❌ Errors: {len(error_links)}")
        
        # Show redirects
        if redirect_links:
            print("\n" + "-"*80)
            print("REDIRECTS (may need updating):")
            print("-"*80)
            for r in redirect_links:
                print(f"\n📍 {r['text']}")
                print(f"   From: {r['url']}")
                print(f"   To:   {r['redirect']}")
        
        # Show errors
        if error_links:
            print("\n" + "-"*80)
            print("ERRORS (need attention):")
            print("-"*80)
            for r in error_links:
                print(f"\n❌ {r['text']}")
                print(f"   URL: {r['url']}")
                print(f"   Status: {r['status']}")
                if r['error']:
                    print(f"   Error: {r['error']}")
        
        # Show all results in a table
        print("\n" + "-"*80)
        print("DETAILED RESULTS:")
        print("-"*80)
        
        for r in sorted(results, key=lambda x: (x['status'], x['url'])):
            status_str = f"{r['status']} ({r['status_code']})" if r['status_code'] else r['status']
            print(f"{status_str:20} | {r['url'][:60]}")
            
        print("\n" + "="*80)
        
        # Save to file
        self.save_report(results)
        
    def save_report(self, results: List[Dict]):
        """Save detailed report to file"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        report_file = f'link_check_report_{timestamp}.txt'
        
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write("LINK CHECK DETAILED REPORT\n")
            f.write(f"Generated: {datetime.now()}\n")
            f.write("="*80 + "\n\n")
            
            for r in results:
                f.write(f"Text: {r['text']}\n")
                f.write(f"URL: {r['url']}\n")
                f.write(f"Status: {r['status']}\n")
                f.write(f"Status Code: {r['status_code']}\n")
                if r['redirect']:
                    f.write(f"Redirected to: {r['redirect']}\n")
                if r['error']:
                    f.write(f"Error: {r['error']}\n")
                f.write("-"*40 + "\n")
                
        print(f"\n📝 Detailed report saved to: {report_file}")

def main():
    # File to check
    markdown_file = "Comprehensive_Sybrin_Customer_List_2025.md"
    
    print(f"🔎 Link Checker for {markdown_file}")
    print("="*80)
    
    checker = LinkChecker(timeout=10)
    
    # Extract links
    links = checker.extract_links_from_markdown(markdown_file)
    
    if not links:
        print("No links found in the document.")
        return
    
    print(f"📊 Found {len(links)} links to check")
    
    # Remove duplicates while preserving order
    unique_links = []
    seen_urls = set()
    for text, url in links:
        if url not in seen_urls:
            unique_links.append((text, url))
            seen_urls.add(url)
            
    print(f"📊 {len(unique_links)} unique links to check")
    
    # Check links
    results = checker.check_links_parallel(unique_links, max_workers=5)
    
    # Print report
    checker.print_report(results)

if __name__ == "__main__":
    main()