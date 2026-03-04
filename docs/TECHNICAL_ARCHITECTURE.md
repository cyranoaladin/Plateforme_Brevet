# 🏗️ Architecture Technique - BREVET MASTER

Ce document décrit en détail les choix d'architecture technique pour le projet **BREVET MASTER**.

## 🔄 Flux de Données et État Global
Le projet utilise la **React Context API** (`src/context/GameContext.tsx`) pour gérer l'état persistant de l'élève.

### État de l'Utilisateur
L'application maintient en temps réel :
- `xp` (Expérience totale cumulée)
- `gems` (Monnaie virtuelle pour les récompenses)
- `energy` (Ressource limitée : 30 points max, 1-2 points consommés par activité)
- `rank` (Rang calculé dynamiquement basé sur l'XP)

### Persistance
L'état est synchronisé avec le **Local Storage** (`localStorage`) du navigateur. Cela permet une persistance immédiate sans base de données pour le MVP, tout en offrant une expérience utilisateur fluide.

## 🎨 Design System (Tailwind CSS)
Le design system est défini dans `src/app/globals.css` via les variables CSS de Tailwind.

### Couleurs Principales
- **Background** : `#0B1120` (Dark Gaming)
- **Primary** : `#1A3C6E` (Confiance, institutionnel)
- **Accent** : `#F97316` (Énergie, récompenses)
- **Secondary** : `#7C3AED` (IA, Mentor ARIA)
- **Success** : `#16A34A` (Validation, réussite)

### Typographie
- **Body** : *Inter* (Lisibilité optimale pour les cours)
- **Titres/Rangs** : *Bebas Neue* (Impact visuel gaming)

## 🧩 Composants Clés
1. **Sidebar (`src/components/Sidebar.tsx`)** : Navigation principale avec compte à rebours avant le Brevet.
2. **TopBar (`src/components/TopBar.tsx`)** : Affiche les ressources (XP, Gems, Energy) et le rang actuel avec une barre de progression animée.
3. **Providers (`src/components/Providers.tsx`)** : Encapsule l'application dans le `GameProvider`.

## 🛣️ Routage (App Router)
Le routage est structuré pour permettre une expansion facile par matière :
- `/` : Le "QG" (Dashboard)
- `/learn/[matière]/[notion]` : Les modules d'apprentissage (ex: `/learn/maths/thales`)
- `/duels` : Espace compétitif (Prévu V2)
- `/mentor` : Interface IA ARIA (Prévu V2 via RAG)
