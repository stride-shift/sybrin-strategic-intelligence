import asyncio
import base64
from io import BytesIO
from typing import List, Dict, Any
import json
from pathlib import Path
from pdf2image import convert_from_path
from PIL import Image
import aiofiles
from openai import AsyncOpenAI
import time
from tqdm.asyncio import tqdm
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class PDFSlideProcessor:
    """Process PDF slides through OpenAI's GPT-4o vision API"""
    
    def __init__(self, api_key: str = None, model: str = "gpt-4o", max_concurrent: int = 100):
        """
        Initialize the PDF processor
        
        Args:
            api_key: OpenAI API key (if None, uses environment variable)
            model: Model to use ("gpt-4o" or "gpt-4o-mini")
            max_concurrent: Maximum concurrent API requests
        """
        self.client = AsyncOpenAI(api_key=api_key)
        self.model = model
        self.max_concurrent = max_concurrent
        self.semaphore = asyncio.Semaphore(max_concurrent)
        
    def pdf_to_base64_images(self, pdf_path: str, dpi: int = 150, format: str = "JPEG", 
                             quality: int = 85, max_size: tuple = (1920, 1920)) -> List[Dict]:
        """
        Convert PDF to base64 encoded images
        
        Args:
            pdf_path: Path to PDF file
            dpi: DPI for conversion (higher = better quality but larger size)
            format: Image format (JPEG recommended for smaller size)
            quality: JPEG quality (1-100, only for JPEG)
            max_size: Maximum dimensions (width, height) to resize images
            
        Returns:
            List of dicts with page_num and base64 data
        """
        logger.info(f"Converting PDF: {pdf_path}")
        
        # Convert PDF to PIL images
        images = convert_from_path(pdf_path, dpi=dpi)
        
        base64_images = []
        for i, img in enumerate(images, 1):
            # Resize if necessary to reduce token usage
            if img.size[0] > max_size[0] or img.size[1] > max_size[1]:
                img.thumbnail(max_size, Image.Resampling.LANCZOS)
                logger.debug(f"Resized page {i} to {img.size}")
            
            # Convert to base64
            buffer = BytesIO()
            if format == "JPEG":
                # Convert RGBA to RGB if necessary
                if img.mode in ('RGBA', 'LA', 'P'):
                    rgb_img = Image.new('RGB', img.size, (255, 255, 255))
                    rgb_img.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                    img = rgb_img
                img.save(buffer, format=format, quality=quality, optimize=True)
            else:
                img.save(buffer, format=format)
            
            base64_data = base64.b64encode(buffer.getvalue()).decode('utf-8')
            
            base64_images.append({
                'page_num': i,
                'base64': base64_data,
                'size_kb': len(base64_data) / 1024  # Size in KB
            })
            
            logger.debug(f"Page {i}: {len(base64_data)/1024:.1f} KB")
        
        logger.info(f"Converted {len(images)} pages, total size: {sum(img['size_kb'] for img in base64_images):.1f} KB")
        return base64_images
    
    async def process_single_slide(self, slide_data: Dict, prompt: str = None) -> Dict:
        """
        Process a single slide with OpenAI API
        
        Args:
            slide_data: Dict with 'page_num' and 'base64' keys
            prompt: Custom prompt for extraction
            
        Returns:
            Dict with page_num and extracted content
        """
        if prompt is None:
            prompt = """Extract and structure ALL content from this presentation slide:
            1. Title/Headers
            2. Bullet points and text
            3. Tables (preserve structure)
            4. Diagram descriptions
            5. Chart data and insights
            6. Any footnotes or references
            
            Return as structured JSON with these sections."""
        
        async with self.semaphore:
            try:
                start_time = time.time()
                
                response = await self.client.chat.completions.create(
                    model=self.model,
                    messages=[{
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{slide_data['base64']}",
                                    "detail": "high"  # Use "high" for detailed extraction
                                }
                            }
                        ]
                    }],
                    response_format={"type": "json_object"},
                    temperature=0.1,  # Low temperature for consistent extraction
                    max_tokens=1000
                )
                
                processing_time = time.time() - start_time
                content = json.loads(response.choices[0].message.content)
                
                return {
                    'page_num': slide_data['page_num'],
                    'content': content,
                    'processing_time': processing_time,
                    'tokens_used': response.usage.total_tokens if response.usage else None,
                    'status': 'success'
                }
                
            except Exception as e:
                logger.error(f"Error processing page {slide_data['page_num']}: {str(e)}")
                return {
                    'page_num': slide_data['page_num'],
                    'content': None,
                    'error': str(e),
                    'status': 'error'
                }
    
    async def process_batch(self, slides: List[Dict], prompt: str = None) -> List[Dict]:
        """
        Process a batch of slides concurrently
        
        Args:
            slides: List of slide data dicts
            prompt: Custom extraction prompt
            
        Returns:
            List of results
        """
        tasks = [self.process_single_slide(slide, prompt) for slide in slides]
        
        # Use tqdm for progress bar
        results = await tqdm.gather(*tasks, desc=f"Processing batch of {len(slides)} slides")
        
        return results
    
    async def process_pdf(self, pdf_path: str, output_path: str = None, 
                         batch_size: int = 100, prompt: str = None,
                         save_intermediate: bool = True) -> Dict:
        """
        Main method to process entire PDF
        
        Args:
            pdf_path: Path to PDF file
            output_path: Path to save results JSON
            batch_size: Number of pages to process concurrently
            prompt: Custom extraction prompt
            save_intermediate: Save results after each batch
            
        Returns:
            Dict with all results and statistics
        """
        # Convert PDF to base64 images
        logger.info("Starting PDF conversion...")
        slides = self.pdf_to_base64_images(pdf_path)
        
        # Process in batches
        all_results = []
        total_pages = len(slides)
        total_tokens = 0
        total_time = 0
        
        logger.info(f"Processing {total_pages} pages in batches of {batch_size}...")
        
        for i in range(0, total_pages, batch_size):
            batch = slides[i:i+batch_size]
            batch_num = i // batch_size + 1
            total_batches = (total_pages + batch_size - 1) // batch_size
            
            logger.info(f"Processing batch {batch_num}/{total_batches} (pages {i+1}-{min(i+batch_size, total_pages)})")
            
            batch_start = time.time()
            results = await self.process_batch(batch, prompt)
            batch_time = time.time() - batch_start
            
            all_results.extend(results)
            
            # Calculate statistics
            batch_tokens = sum(r.get('tokens_used', 0) for r in results if r.get('tokens_used'))
            successful = sum(1 for r in results if r['status'] == 'success')
            
            total_tokens += batch_tokens
            total_time += batch_time
            
            logger.info(f"Batch {batch_num} complete: {successful}/{len(batch)} successful, "
                       f"{batch_tokens:,} tokens, {batch_time:.1f}s")
            
            # Save intermediate results
            if save_intermediate and output_path:
                intermediate_path = Path(output_path).with_suffix(f'.batch_{batch_num}.json')
                await self.save_results(all_results, intermediate_path)
        
        # Prepare final results
        final_results = {
            'metadata': {
                'pdf_path': pdf_path,
                'total_pages': total_pages,
                'model': self.model,
                'batch_size': batch_size,
                'processing_time_seconds': total_time,
                'total_tokens': total_tokens,
                'estimated_cost_usd': self.estimate_cost(total_tokens),
                'successful_pages': sum(1 for r in all_results if r['status'] == 'success'),
                'failed_pages': sum(1 for r in all_results if r['status'] == 'error')
            },
            'pages': sorted(all_results, key=lambda x: x['page_num'])
        }
        
        # Save final results
        if output_path:
            await self.save_results(final_results, output_path)
            logger.info(f"Results saved to {output_path}")
        
        # Print summary
        self.print_summary(final_results['metadata'])
        
        return final_results
    
    def estimate_cost(self, total_tokens: int) -> float:
        """Estimate cost based on token usage"""
        if self.model == "gpt-4o":
            # Rough estimate: 80% input, 20% output
            input_tokens = int(total_tokens * 0.8)
            output_tokens = int(total_tokens * 0.2)
            cost = (input_tokens * 2.50 / 1_000_000) + (output_tokens * 10.00 / 1_000_000)
        else:  # gpt-4o-mini
            input_tokens = int(total_tokens * 0.8)
            output_tokens = int(total_tokens * 0.2)
            cost = (input_tokens * 0.15 / 1_000_000) + (output_tokens * 0.60 / 1_000_000)
        return round(cost, 4)
    
    async def save_results(self, results: Any, output_path: str):
        """Save results to JSON file"""
        async with aiofiles.open(output_path, 'w') as f:
            await f.write(json.dumps(results, indent=2, ensure_ascii=False))
    
    def print_summary(self, metadata: Dict):
        """Print processing summary"""
        print("\n" + "="*50)
        print("PROCESSING SUMMARY")
        print("="*50)
        print(f"Total Pages: {metadata['total_pages']}")
        print(f"Successful: {metadata['successful_pages']}")
        print(f"Failed: {metadata['failed_pages']}")
        print(f"Model: {metadata['model']}")
        print(f"Total Tokens: {metadata['total_tokens']:,}")
        print(f"Estimated Cost: ${metadata['estimated_cost_usd']:.2f}")
        print(f"Processing Time: {metadata['processing_time_seconds']:.1f} seconds")
        print(f"Avg Time/Page: {metadata['processing_time_seconds']/metadata['total_pages']:.2f} seconds")
        print("="*50)


# Example usage
async def main():
    # Initialize processor
    processor = PDFSlideProcessor(
        model="gpt-4o",  # or "gpt-4o-mini" for lower cost
        max_concurrent=100  # Process 100 pages at once
    )
    
    # Custom prompt (optional)
    custom_prompt = """
    Extract all content from this slide and structure it as JSON with:
    - title: Main slide title
    - headers: Section headers
    - content: All text content
    - tables: Any tables with rows and columns
    - diagrams: Description of diagrams/charts
    - key_points: Main takeaways
    """
    
    # Process PDF
    results = await processor.process_pdf(
        pdf_path="presentation.pdf",
        output_path="extracted_content.json",
        batch_size=100,  # Process 100 at a time
        prompt=custom_prompt,  # Optional custom prompt
        save_intermediate=True  # Save after each batch
    )
    
    # Access individual page results
    for page in results['pages'][:3]:  # Show first 3 pages
        if page['status'] == 'success':
            print(f"\nPage {page['page_num']}:")
            print(json.dumps(page['content'], indent=2)[:500] + "...")


if __name__ == "__main__":
    # Run the async main function
    asyncio.run(main())