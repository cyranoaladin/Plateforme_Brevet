import json
import hashlib
import numpy as np
import re
import os

def get_embedding(text, vector_size=384):
    vector = np.zeros(vector_size)
    tokens = re.findall(r'[a-z0-9à-ÿ]+', text.lower())
    for token in tokens:
        h_hex = hashlib.md5(token.encode('utf-8')).hexdigest()
        h_int = int(h_hex, 16)
        idx = h_int % vector_size
        vector[idx] += 1
    norm = np.linalg.norm(vector)
    if norm > 0:
        vector = vector / norm
    return vector.tolist()

texts = [
    "Thalès de Milet",
    "La République française est indivisible, laïque, démocratique et sociale.",
    "L'accord du participe passé avec l'auxiliaire avoir.",
    "Calculer la médiane d'une série statistique.",
    "Vecteur nul",
    "1234567890",
    "   ",
    "Mélange d'ACCENTS et de PONCTUATION !!!"
]

fixtures = []
for t in texts:
    fixtures.append({
        "text": t,
        "vector": get_embedding(t)
    })

os.makedirs("src/__tests__/fixtures", exist_ok=True)
with open("src/__tests__/fixtures/embedding_parity.json", "w", encoding="utf-8") as f:
    json.dump(fixtures, f, ensure_ascii=False, indent=2)

print("✅ Fixtures generated in src/__tests__/fixtures/embedding_parity.json")
