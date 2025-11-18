#!/usr/bin/env python3
"""
Setup script for OpenAI Assistants API File Search
Uploads all research documents and creates an assistant
"""

import os
from pathlib import Path
from openai import OpenAI
from dotenv import load_dotenv
import json
import time

# Load environment variables
load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Configuration
DATA_DIR = Path(__file__).parent / "All_Research_Artifacts_Flat"
CONFIG_FILE = Path(__file__).parent / "assistant_config.json"

def load_existing_config():
    """Load existing assistant configuration if it exists"""
    if CONFIG_FILE.exists():
        with open(CONFIG_FILE, 'r') as f:
            return json.load(f)
    return None

def save_config(config):
    """Save assistant configuration"""
    with open(CONFIG_FILE, 'w') as f:
        json.dump(config, f, indent=2)
    print(f"\n✅ Configuration saved to {CONFIG_FILE}")

def get_supported_files(directory):
    """Get all supported file types from directory"""
    supported_extensions = {'.md', '.txt', '.pdf', '.docx', '.doc'}
    files = []

    for ext in supported_extensions:
        files.extend(list(directory.glob(f"*{ext}")))

    return sorted(files)

def upload_files_to_vector_store(files, batch_size=100):
    """
    Upload files to OpenAI Vector Store in batches

    Note: OpenAI has a limit of ~500 files per batch upload
    """
    print(f"\n📁 Found {len(files)} files to upload")

    # Create vector store
    print("\n🏗️  Creating vector store...")
    vector_store = client.vector_stores.create(
        name="Sybrin Research V2 - All Artifacts",
        expires_after={
            "anchor": "last_active_at",
            "days": 365  # Keep for 1 year of inactivity
        }
    )
    print(f"✅ Vector store created: {vector_store.id}")

    # Upload files in batches
    total_batches = (len(files) + batch_size - 1) // batch_size

    for batch_num in range(total_batches):
        start_idx = batch_num * batch_size
        end_idx = min(start_idx + batch_size, len(files))
        batch_files = files[start_idx:end_idx]

        print(f"\n📤 Uploading batch {batch_num + 1}/{total_batches} ({len(batch_files)} files)...")

        # Open file streams
        file_streams = []
        for file_path in batch_files:
            try:
                file_streams.append(open(file_path, "rb"))
            except Exception as e:
                print(f"⚠️  Warning: Could not open {file_path.name}: {e}")

        if not file_streams:
            continue

        # Upload batch
        try:
            file_batch = client.vector_stores.file_batches.upload_and_poll(
                vector_store_id=vector_store.id,
                files=file_streams
            )

            print(f"✅ Batch {batch_num + 1} status: {file_batch.status}")
            print(f"   Files processed: {file_batch.file_counts.completed}/{file_batch.file_counts.total}")

            if file_batch.file_counts.failed > 0:
                print(f"   ⚠️  Failed files: {file_batch.file_counts.failed}")

        except Exception as e:
            print(f"❌ Error uploading batch {batch_num + 1}: {e}")

        finally:
            # Close all file streams
            for stream in file_streams:
                stream.close()

        # Small delay between batches
        if batch_num < total_batches - 1:
            time.sleep(1)

    # Get final vector store status
    vector_store = client.vector_stores.retrieve(vector_store.id)
    print(f"\n✅ Vector store ready!")
    print(f"   Total files: {vector_store.file_counts.completed}")
    print(f"   Status: {vector_store.status}")

    return vector_store

def create_assistant(vector_store_id):
    """Create an assistant with File Search enabled"""
    print("\n🤖 Creating research assistant...")

    assistant = client.beta.assistants.create(
        name="Sybrin Research Assistant",
        instructions="""You are an expert market research analyst specializing in African fintech markets and the Philippines.

Your role is to:
1. Answer questions about market entry strategies, regulatory requirements, competitive landscapes, and customer insights
2. Provide specific, data-driven answers with citations from the research documents
3. Compare and contrast information across different markets when asked
4. Synthesize insights from multiple documents to answer complex questions
5. Always cite your sources by mentioning the specific document or country analysis

When answering:
- Be specific and reference actual data points from the documents
- Use bullet points for clarity when listing multiple items
- Highlight key differences when comparing markets
- Provide context for your recommendations
- If information isn't in the research, say so clearly""",
        model="gpt-4o",
        tools=[{"type": "file_search"}],
        tool_resources={
            "file_search": {
                "vector_store_ids": [vector_store_id]
            }
        },
        temperature=0.1  # Lower temperature for more consistent, factual responses
    )

    print(f"✅ Assistant created: {assistant.id}")
    print(f"   Model: {assistant.model}")
    print(f"   Name: {assistant.name}")

    return assistant

def main():
    """Main setup process"""
    print("="*70)
    print("🚀 OpenAI File Search Setup for Sybrin Research")
    print("="*70)

    # Check if setup already exists
    existing_config = load_existing_config()
    if existing_config:
        print("\n⚠️  Found existing configuration:")
        print(f"   Assistant ID: {existing_config.get('assistant_id')}")
        print(f"   Vector Store ID: {existing_config.get('vector_store_id')}")

        response = input("\nDo you want to create a new setup? (yes/no): ").lower()
        if response not in ['yes', 'y']:
            print("\n✅ Using existing configuration. Run query_research.py to ask questions.")
            return

    # Get files
    files = get_supported_files(DATA_DIR)
    if not files:
        print(f"❌ No supported files found in {DATA_DIR}")
        return

    print(f"\n📊 File breakdown:")
    extensions = {}
    for f in files:
        ext = f.suffix
        extensions[ext] = extensions.get(ext, 0) + 1
    for ext, count in sorted(extensions.items()):
        print(f"   {ext}: {count} files")

    # Upload files
    vector_store = upload_files_to_vector_store(files)

    # Create assistant
    assistant = create_assistant(vector_store.id)

    # Save configuration
    config = {
        "assistant_id": assistant.id,
        "vector_store_id": vector_store.id,
        "created_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "total_files": len(files)
    }
    save_config(config)

    print("\n" + "="*70)
    print("✅ Setup complete!")
    print("="*70)
    print(f"\nAssistant ID: {assistant.id}")
    print(f"Vector Store ID: {vector_store.id}")
    print(f"\n💡 Next steps:")
    print("   1. Run: python query_research.py")
    print("   2. Ask questions about your research!")
    print("\n📝 Example queries:")
    print('   - "Compare regulatory costs in Kenya vs Tanzania"')
    print('   - "What are the main market entry barriers in South Africa?"')
    print('   - "Summarize customer pain points across East African markets"')

if __name__ == "__main__":
    main()
