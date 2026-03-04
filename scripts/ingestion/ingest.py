import os
import argparse
import sys
from loaders.pdf_loader import PDFLoader
from chunkers.semantic_chunker import SemanticChunker
from exporters.qdrant_exporter import QdrantExporter
from tqdm import tqdm

def main():
    parser = argparse.ArgumentParser(description="Pipeline d'ingestion ARIA - BREVET MASTER")
    parser.add_argument("--input", default="../../data/docs", help="Dossier source des PDF")
    parser.add_argument("--mode", default="local", choices=["local", "api"], help="Mode d'embedding (local/api)")
    parser.add_argument("--subject", required=True, help="Matière associée (ex: maths, francais)")
    parser.add_argument("--year", default=2024, type=int, help="Année du document")
    args = parser.parse_args()

    # Vérification du dossier d'entrée
    if not os.path.exists(args.input):
        print(f"❌ Erreur : Le dossier {args.input} n'existe pas.")
        sys.exit(1)

    pdf_files = [f for f in os.listdir(args.input) if f.endswith(".pdf")]
    if not pdf_files:
        print(f"⚠️ Aucun fichier PDF trouvé dans {args.input}")
        sys.exit(0)

    print(f"🚀 Ingestion de {len(pdf_files)} documents pour la matière : {args.subject.upper()}")
    
    loader = PDFLoader()
    chunker = SemanticChunker()
    exporter = QdrantExporter(mode=args.mode)

    total_chunks = 0
    errors = 0

    for filename in tqdm(pdf_files, desc="Processing PDF"):
        file_path = os.path.join(args.input, filename)
        try:
            # 1. Extraction
            pages = loader.load(file_path)
            
            # 2. Enrichissement métadonnées
            for p in pages:
                p["metadata"].update({
                    "subject": args.subject,
                    "level": "3e",
                    "year": args.year
                })
            
            # 3. Chunking
            chunks = chunker.split(pages)
            
            # 4. Export
            count = exporter.export(chunks)
            total_chunks += count
            
        except Exception as e:
            print(f"\n❌ Erreur sur {filename}: {str(e)}")
            errors += 1

    print("\n--- RAPPORT D'INGESTION ---")
    print(f"✅ Documents traités : {len(pdf_files) - errors}")
    print(f"📂 Total Chunks indexés : {total_chunks}")
    print(f"⚠️ Échecs : {errors}")
    print(f"📍 Collection Qdrant : aria_docs")
    print("--------------------------")

if __name__ == "__main__":
    main()
