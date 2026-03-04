# 🎮 Moteur de Gamification - BREVET MASTER

Ce document détaille les mécaniques de jeu implémentées pour maximiser l'engagement des élèves dans leurs révisions.

## 🎖️ Système de Rangs
La progression est structurée autour de rangs prestigieux débloqués par l'accumulation d'XP.

| Rang | Nom | XP Requis | Déblocages (V1) |
| :--- | :--- | :--- | :--- |
| **1** | **Apprenti du Savoir** | 0 - 500 | Accès aux cours de base |
| **2** | **Explorateur** | 500 - 1 500 | Badges de base |
| **3** | **Chevalier du Brevet** | 1 500 - 4 000 | Accès aux duels |
| **4** | **Maître des Révisions** | 4 000 - 8 000 | Personnalisation Avatar |
| **5** | **Expert DNB** | 8 000+ | Examens Blancs complets |

## 💰 Économie Virtuelle
Le système repose sur deux ressources principales :

### 1. Les GEMMES (💎)
- **Obtention** : Réussite de quiz, complétion de quêtes, bonus de streak.
- **Utilisation** : (V2) Achat de jokers pour les examens blancs, thèmes visuels.
- **Équité** : Non achetables avec de l'argent réel.

### 2. l'ÉNERGIE (⚡)
- **Capacité** : 30 points maximum (recharge automatique).
- **Consommation** : 2 points par quiz/leçon interactive.
- **Rôle** : Créer un rythme de révision sain (session-based learning) et éviter le burnout.

## 🔥 Engagement (Streak & Quêtes)
- **Streak** : Le "Streak de révision" incite à une connexion quotidienne. Plus le streak est élevé, plus les multiplicateurs d'XP sont importants.
- **Quêtes Quotidiennes** : Objectifs simples (ex: "Terminer 1 leçon de Maths") pour donner un sentiment d'accomplissement immédiat.

## 📊 Feedback Visuel (Dopamine Loop)
Chaque interaction réussie déclenche :
1. Une animation de succès (Vibration mobile, confettis visuels).
2. Un gain immédiat affiché à l'écran (+25 XP, +5 💎).
3. Une mise à jour de la barre de progression vers le rang suivant.
