# Guide de Diagnostic Qdrant

Si Mentor ARIA renvoie des messages de type "Sources indisponibles", suivez ces étapes.

## 1. Vérifier l'état du conteneur
```bash
./scripts/dev/qdrant.sh status
```
S'il n'est pas "Up", relancez-le : `./scripts/dev/qdrant.sh start`.

## 2. Tester l'API REST
Ouvrez `http://localhost:6333/readyz` dans votre navigateur ou via curl :
```bash
curl http://localhost:6333/readyz
```
Réponse attendue : `all good`.

## 3. Consulter les logs d'erreurs
```bash
./scripts/dev/qdrant.sh logs
```
Recherchez des erreurs de type "Storage error" ou "Out of memory".

## 4. Réinitialisation complète (Dernier recours)
Si la base est corrompue :
```bash
./scripts/dev/qdrant.sh reset
```
Puis ré-ingérez les documents via le script Python.
