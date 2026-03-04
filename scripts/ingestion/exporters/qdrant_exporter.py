import hashlib
import numpy as np
import os
import uuid
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, VectorParams, Distance

class QdrantExporter:
    """Gère la génération des vecteurs et l'export vers la base Qdrant."""
    
    def __init__(self, url="http://localhost:6333", mode="local"):
        self.client = QdrantClient(url=url)
        self.mode = mode
        self.collection_name = "aria_docs"
        self.vector_size = 384 # Taille fixe pour cohérence avec le mock JS

    def _get_embedding(self, text):
        if self.mode == "api":
            pass
            
        import re
        vector = np.zeros(self.vector_size)
        # Même logique que JS match(/[a-z0-9à-ÿ]+/g)
        words = re.findall(r'[a-z0-9à-ÿ]+', text.lower())
        
        for word in words:
            h_hex = hashlib.md5(word.encode('utf-8')).hexdigest()
            h_int = int(h_hex, 16)
            idx = h_int % self.vector_size
            vector[idx] += 1
        
        norm = np.linalg.norm(vector)
        if norm > 0:
            vector = vector / norm
        return vector.tolist()

    def init_collection(self):
        collections = self.client.get_collections().collections
        if not any(c.name == self.collection_name for c in collections):
            print(f"📦 Création de la collection '{self.collection_name}'...")
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(size=self.vector_size, distance=Distance.COSINE),
            )

    def export(self, chunks):
        self.init_collection()
        points = []
        for i, chunk in enumerate(chunks):
            # Qdrant exige un UUID ou un entier non signé 64 bits
            seed_string = f"{chunk['metadata']['sourceTitle']}_{i}"
            point_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, seed_string))
            
            vector = self._get_embedding(chunk["text"])
            
            points.append(PointStruct(
                id=point_id,
                vector=vector,
                payload={
                    "text": chunk["text"],
                    **chunk["metadata"]
                }
            ))
        
        if points:
            self.client.upsert(collection_name=self.collection_name, points=points)
        return len(points)
