# Spécification Technique : Local Embeddings ARIA (V1.1)

Cette spécification garantit la parité mathématique entre les environnements Node.js et Python.

## Algorithme : Hashed Bag-of-Words (HBOW)

### 1. Tokenisation (Crucial)
- **Casse** : Conversion intégrale en minuscules (`.toLowerCase()`).
- **Extraction** : Utilisation de la regex `[a-z0-9à-ÿ]+`.
- **JS** : `text.toLowerCase().match(/[a-z0-9à-ÿ]+/g) || []`
- **Python** : `re.findall(r'[a-z0-9à-ÿ]+', text.lower())`

### 2. Calcul des indices
- Pour chaque token :
  - Calcul du hash **MD5** du mot (encodage UTF-8).
  - Conversion du hash hexadécimal en entier non signé (128-bit).
  - Indice dans le vecteur = `entier % 384`.
  - Incrémenter la valeur à cet indice de `+1`.

### 3. Normalisation (L2)
- **Précision** : Utilisation de flottants natifs (64-bit). Aucune quantification ou arrondi manuel (`toFixed` interdit).
- Calcul de la norme euclidienne : `norm = sqrt(sum(valeurs^2))`.
- Si `norm > 0`, diviser chaque composante par `norm`.

## Constantes
- **VECTOR_SIZE** : 384
- **DISTANCE** : Cosine (Qdrant)
- **TOLÉRANCE PARITÉ** : `1e-7` (Différence absolue acceptable entre JS et Python).

## Golden Test Case
Texte : `"ARIA"` -> Index actif : **87**.
Vecteur non-vide => Norme L2 doit être exactement **1.0** (ou `abs(1.0 - norm) < 1e-9`).
