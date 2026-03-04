# 🎓 BREVET MASTER - Documentation Globale (V1.0 MVP)

**BREVET MASTER** est une plateforme adaptative et gamifiée de préparation au Diplôme National du Brevet (DNB) pour les élèves de Troisième, conçue selon le programme de l'Enseignement National Français.

---

## 🎮 Vision & Objectifs
Transformer la révision du Brevet en une expérience addictive et engageante ("Gaming for Education"). 
- **Engagement** : Utilisation des leviers d'Octalysis (XP, Rangs, Gemmes, Énergie).
- **Adaptabilité** : Parcours personnalisés basés sur le profil de l'élève (PAD).
- **Fiabilité** : Contenu aligné 100% sur le Bulletin Officiel de l'Éducation Nationale.

---

## 🛠️ Stack Technologique (Mars 2026)
Le projet utilise une stack moderne et performante :
- **Framework** : Next.js 14 (App Router) - SSR/SSG pour la performance.
- **Langage** : TypeScript (Typage fort pour la maintenabilité).
- **Styling** : Tailwind CSS (Gaming Dark Mode, Design System sur mesure).
- **Animations** : Framer Motion (Feedback visuel immédiat, transitions fluides).
- **Icônes** : Lucide React (Consistance visuelle).
- **État Global** : React Context API (Persistance locale via localStorage).

---

## 🏗️ Structure de l'Application
```text
brevet-master/
├── src/
│   ├── app/                # Routes et Pages (Dashboard, Learn, etc.)
│   ├── components/         # Composants UI réutilisables (Sidebar, TopBar)
│   ├── context/            # Moteur de Gamification (XP, Rangs, Ressources)
│   └── styles/             # Configurations Globales et Thème Gaming
├── docs/                   # Documentation détaillée (Audit)
└── public/                 # Assets statiques et média
```

---

## 🚀 Installation et Lancement

### 1. Configuration de l'environnement
Copiez le fichier d'exemple et remplissez vos clés API :
```bash
cp .env.example .env.local
```

### 2. Lancer l'infrastructure (Qdrant)
Le projet utilise Qdrant pour la recherche vectorielle. Utilisez le script utilitaire :
```bash
./scripts/dev/qdrant.sh start
```
*Autres commandes : `stop`, `reset`, `logs`, `status`.*

### 3. Lancer l'application Next.js
```bash
npm install
npm run dev
```
La plateforme sera accessible sur `http://localhost:3000`.

---

## 📑 Documentation Additionnelle
Pour un audit approfondi, consultez les documents suivants dans le dossier `/docs` :
1. [Architecture Technique](./docs/TECHNICAL_ARCHITECTURE.md) : Détails sur le GameContext et le routing.
2. [Système de Gamification](./docs/GAMIFICATION_ENGINE.md) : Rangs, calcul d'XP et économie virtuelle.
3. [Structure des Contenus](./docs/CONTENT_STRUCTURE.md) : Organisation des leçons et quiz.
4. [Feuille de Route (Roadmap)](./docs/ROADMAP.md) : État actuel vs Future (RAG, IA ARIA).
