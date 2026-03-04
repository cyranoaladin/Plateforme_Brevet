from pypdf import PdfReader
import os

class PDFLoader:
    """Responsable de l'extraction de texte et des métadonnées de base des PDF."""
    
    def load(self, file_path):
        reader = PdfReader(file_path)
        pages_content = []
        file_name = os.path.basename(file_path)
        
        # Détection du type de document
        doc_type = "BO" if "BO" in file_name.upper() else "Fiche"
        
        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            if text and len(text.strip()) > 50: # Filtre les pages vides ou quasi-vides
                pages_content.append({
                    "text": text,
                    "metadata": {
                        "sourceTitle": file_name,
                        "pageNumber": i + 1,
                        "docType": doc_type,
                    }
                })
        
        # Ajout du pageRange global
        total_pages = len(reader.pages)
        for p in pages_content:
            p["metadata"]["pageRange"] = f"1-{total_pages}"
            
        return pages_content
