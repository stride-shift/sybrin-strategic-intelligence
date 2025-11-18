import asyncio
import os
from dotenv import load_dotenv
from deck_processor import PDFSlideProcessor

# Load environment variables from .env file
load_dotenv()

async def main():
    # Initialize processor - will use OPENAI_API_KEY from environment
    processor = PDFSlideProcessor(
        model="gpt-4o",  # or "gpt-4o-mini" for lower cost
        max_concurrent=100  # Adjust based on your needs
    )
    
    # Custom prompt for extracting Sybrin company information
    custom_prompt = """
    Extract all content from this slide and structure it as JSON with:
    - title: Main slide title
    - headers: Section headers
    - content: All text content
    - tables: Any tables with rows and columns
    - diagrams: Description of diagrams/charts
    - key_points: Main takeaways
    - products: Any product names or solutions mentioned
    - technologies: Any technologies or technical terms mentioned
    """
    
    # Process the Sybrin PDF
    results = await processor.process_pdf(
        pdf_path="Sybrin Company Overview & Solutions.pdf",
        output_path="sybrin_extracted_content.json",
        batch_size=10,  # Process 10 pages at a time
        prompt=custom_prompt,
        save_intermediate=True  # Save after each batch
    )
    
    print("\nExtraction complete! Check sybrin_extracted_content.json for results.")

if __name__ == "__main__":
    asyncio.run(main())