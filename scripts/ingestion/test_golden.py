import hashlib
import numpy as np
import re

def get_embedding(text, vector_size=384):
    vector = np.zeros(vector_size)
    # Tokenisation Standard V1.1
    tokens = re.findall(r'[a-z0-9à-ÿ]+', text.lower())
    if not tokens:
        return vector.tolist()
        
    for token in tokens:
        h_hex = hashlib.md5(token.encode('utf-8')).hexdigest()
        h_int = int(h_hex, 16)
        idx = h_int % vector_size
        vector[idx] += 1
    
    # Normalisation L2
    norm = np.linalg.norm(vector)
    if norm > 0:
        vector = vector / norm
    return vector.tolist()

def test_protocol_v1_1():
    print("Testing Protocol V1.1...")
    
    # Case 1: ARIA
    v_aria = get_embedding("ARIA")
    idx = np.argmax(v_aria)
    assert idx == 87
    assert abs(v_aria[87] - 1.0) < 1e-9
    
    # Case 2: Accents & Punctuation
    v1 = get_embedding("Thalès !")
    v2 = get_embedding("thalès")
    assert v1 == v2
    
    # Case 3: Norm
    v3 = get_embedding("Le Petit Prince de Saint-Exupéry")
    norm = np.linalg.norm(v3)
    assert abs(norm - 1.0) < 1e-9
    
    print("✅ Python Protocol V1.1 Passed!")

if __name__ == "__main__":
    test_protocol_v1_1()
