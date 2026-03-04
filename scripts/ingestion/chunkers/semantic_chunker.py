from langchain_text_splitters import RecursiveCharacterTextSplitter

class SemanticChunker:
    """Découpe le texte en segments sémantiques avec recouvrement (overlap)."""
    
    def __init__(self, chunk_size=500, chunk_overlap=75):
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            length_function=len,
            separators=["\n\n", "\n", " ", ""]
        )

    def split(self, documents):
        chunks = []
        for doc in documents:
            splits = self.splitter.split_text(doc["text"])
            for i, split in enumerate(splits):
                chunk_meta = doc["metadata"].copy()
                chunk_meta["chunkIndex"] = i
                chunks.append({
                    "text": split,
                    "metadata": chunk_meta
                })
        return chunks
