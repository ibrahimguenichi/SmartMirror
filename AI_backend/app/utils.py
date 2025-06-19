import numpy as np

def normalize_embedding(embedding):
    norm = np.linalg.norm(embedding)
    if norm == 0:
        raise ValueError("Cannot normalize an embedding with zero norm")
    return embedding / norm