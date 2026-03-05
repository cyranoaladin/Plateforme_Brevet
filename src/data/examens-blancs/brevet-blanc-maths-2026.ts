// src/data/examens-blancs/brevet-blanc-maths-2026.ts
export interface BrevetBlanc {
  id: string;
  subjectSlug: string;
  title: string;
  session: string;
  durationMinutes: number;
  totalPoints: number;
  calculatorAllowed: boolean;
  parts: BrevetPart[];
}

export interface BrevetPart {
  id: string;
  title: string;
  durationMinutes: number;
  points: number;
  calculatorAllowed: boolean;
  exercises: BrevetExercise[];
}

export interface BrevetExercise {
  id: string;
  title: string;
  points: number;
  statement: string;
  questions: BrevetQuestion[];
}

export interface BrevetQuestion {
  id: string;
  text: string;
  points: number;
  answer: string;
  methodology: string;
}

export const BREVET_BLANC_MATHS_1: BrevetBlanc = {
  id: 'bb-maths-001',
  subjectSlug: 'maths',
  title: 'Brevet Blanc — Mathématiques n°1',
  session: 'Session 2026 — Brevet Master',
  durationMinutes: 120,
  totalPoints: 100,
  calculatorAllowed: true,
  parts: [
    {
      id: 'bb-maths-001-p1',
      title: 'Partie 1 : Automatismes (sans calculatrice)',
      durationMinutes: 20,
      points: 20,
      calculatorAllowed: false,
      exercises: [
        {
          id: 'bb-m1-ex1',
          title: 'Exercice 1 — Calcul mental et raisonnement',
          points: 20,
          statement: 'Chacune des questions de cette partie est indépendante. Répondez sans calculatrice.',
          questions: [
            {
              id: 'bb-m1-ex1-q1',
              text: '1. Calculez : 2/3 + 5/6',
              points: 2,
              answer: '3/2 ou 1,5',
              methodology: 'Réduire au même dénominateur (6) : 4/6 + 5/6 = 9/6 = 3/2.',
            },
            {
              id: 'bb-m1-ex1-q2',
              text: '2. Donnez le pourcentage que représente 18 par rapport à 72.',
              points: 2,
              answer: '25%',
              methodology: '18/72 = 1/4 = 0,25 = 25%.',
            },
            {
              id: 'bb-m1-ex1-q3',
              text: '3. La moyenne de cinq nombres est 14. Quelle est leur somme ?',
              points: 2,
              answer: '70',
              methodology: 'Somme = moyenne × nombre de valeurs = 14 × 5 = 70.',
            },
            {
              id: 'bb-m1-ex1-q4',
              text: '4. Décomposez 180 en produit de facteurs premiers.',
              points: 3,
              answer: '2² × 3² × 5',
              methodology: '180 = 2×90 = 2×2×45 = 4×45 = 4×9×5 = 2²×3²×5.',
            },
            {
              id: 'bb-m1-ex1-q5',
              text: '5. Une fonction linéaire vérifie f(4) = 12. Calculez f(7).',
              points: 3,
              answer: '21',
              methodology: 'f(x) = ax. f(4) = 4a = 12 → a = 3. f(7) = 3×7 = 21.',
            },
            {
              id: 'bb-m1-ex1-q6',
              text: '6. Dans un triangle ABC rectangle en A, cos(B) = 0,8. Calculez sin(B).',
              points: 3,
              answer: '0,6',
              methodology: 'Relation : sin²(B) + cos²(B) = 1. sin²(B) = 1 − 0,64 = 0,36. sin(B) = 0,6 (B est aigu).',
            },
            {
              id: 'bb-m1-ex1-q7',
              text: '7. Un événement A a une probabilité de 0,35. Quelle est la probabilité de l\'événement contraire ?',
              points: 2,
              answer: '0,65',
              methodology: 'P(Ā) = 1 − P(A) = 1 − 0,35 = 0,65.',
            },
            {
              id: 'bb-m1-ex1-q8',
              text: '8. Simplifiez la fraction : 84/168.',
              points: 3,
              answer: '1/2',
              methodology: '168 = 2 × 84, donc 84/168 = 1/2.',
            },
          ],
        },
      ],
    },
    {
      id: 'bb-maths-001-p2',
      title: 'Partie 2 : Raisonnement et résolution de problèmes (calculatrice autorisée)',
      durationMinutes: 100,
      points: 80,
      calculatorAllowed: true,
      exercises: [
        {
          id: 'bb-m1-ex2',
          title: 'Exercice 2 — Géométrie et Pythagore',
          points: 20,
          statement: 'Dans un triangle ABC, on sait que AB = 10 cm, BC = 24 cm et AC = 26 cm.',
          questions: [
            {
              id: 'bb-m1-ex2-q1',
              text: '1. Montrez que le triangle ABC est rectangle.',
              points: 6,
              answer: 'AB² + BC² = 100 + 576 = 676 = 26² = AC². Par la réciproque du théorème de Pythagore, ABC est rectangle en B.',
              methodology: 'Calculer AB² + BC² et AC². Si égaux, la réciproque de Pythagore confirme le triangle rectangle.',
            },
            {
              id: 'bb-m1-ex2-q2',
              text: '2. Calculez l\'aire du triangle ABC.',
              points: 5,
              answer: '120 cm²',
              methodology: 'Aire = (1/2) × AB × BC = (1/2) × 10 × 24 = 120 cm² (angle droit en B).',
            },
            {
              id: 'bb-m1-ex2-q3',
              text: '3. Calculez la mesure de l\'angle BAC, en degrés. Arrondissez au dixième.',
              points: 5,
              answer: '≈ 67,4°',
              methodology: 'tan(BAC) = BC/AB = 24/10 = 2,4 (angle droit en B). BAC = arctan(2,4) ≈ 67,4°.',
            },
            {
              id: 'bb-m1-ex2-q4',
              text: '4. M est le milieu de AC. Calculez BM.',
              points: 4,
              answer: '13 cm',
              methodology: 'Dans un triangle rectangle, la médiane issue de l\'angle droit vers l\'hypoténuse vaut la moitié de l\'hypoténuse. BM = AC/2 = 26/2 = 13 cm.',
            },
          ],
        },
        {
          id: 'bb-m1-ex3',
          title: 'Exercice 3 — Statistiques et probabilités',
          points: 20,
          statement: 'Une classe de 30 élèves a obtenu les notes suivantes à un contrôle de maths (sur 20) : 4 élèves ont 8 ; 6 élèves ont 10 ; 8 élèves ont 12 ; 7 élèves ont 14 ; 5 élèves ont 16.',
          questions: [
            {
              id: 'bb-m1-ex3-q1',
              text: '1. Calculez la note moyenne de la classe. Arrondissez au centième.',
              points: 6,
              answer: '12,2',
              methodology: 'Somme = 4×8 + 6×10 + 8×12 + 7×14 + 5×16 = 32+60+96+98+80 = 366. Moyenne = 366/30 = 12,2.',
            },
            {
              id: 'bb-m1-ex3-q2',
              text: '2. Déterminez la médiane de cette série.',
              points: 5,
              answer: '12',
              methodology: '30 élèves, médiane = moyenne des 15e et 16e valeurs. Après tri : 4 élèves ≤ 8, 10 ≤ 10, 18 ≤ 12... Les 15e et 16e sont parmi les 8 élèves ayant 12. Médiane = 12.',
            },
            {
              id: 'bb-m1-ex3-q3',
              text: '3. Un élève est choisi au hasard. Quelle est la probabilité que sa note soit strictement supérieure à 12 ?',
              points: 5,
              answer: '12/30 = 2/5 = 0,4',
              methodology: 'Élèves avec note > 12 : 7 (ont 14) + 5 (ont 16) = 12. P = 12/30 = 2/5.',
            },
            {
              id: 'bb-m1-ex3-q4',
              text: '4. Représentez cette distribution par un diagramme en bâtons (schéma attendu sur copie). Que remarquez-vous ?',
              points: 4,
              answer: 'Diagramme avec les 5 barres aux notes 8, 10, 12, 14, 16 avec les hauteurs 4, 6, 8, 7, 5. La distribution est légèrement asymétrique vers les bonnes notes.',
              methodology: 'Axe x = notes, axe y = effectifs. Chaque barre correspond à un effectif.',
            },
          ],
        },
        {
          id: 'bb-m1-ex4',
          title: 'Exercice 4 — Fonctions et calcul littéral',
          points: 20,
          statement: 'Un plombier facture ses interventions de la façon suivante : frais fixes de 40 € + 35 € par heure de travail.',
          questions: [
            {
              id: 'bb-m1-ex4-q1',
              text: '1. Exprimez le coût total C (en €) en fonction du nombre d\'heures h.',
              points: 4,
              answer: 'C(h) = 35h + 40',
              methodology: 'C = coût horaire × h + frais fixes = 35h + 40.',
            },
            {
              id: 'bb-m1-ex4-q2',
              text: '2. Combien coûte une intervention de 3,5 heures ?',
              points: 4,
              answer: '162,50 €',
              methodology: 'C(3,5) = 35 × 3,5 + 40 = 122,5 + 40 = 162,5 €.',
            },
            {
              id: 'bb-m1-ex4-q3',
              text: '3. Un client a reçu une facture de 215 €. Combien d\'heures le plombier a-t-il travaillé ?',
              points: 6,
              answer: '5 heures',
              methodology: '35h + 40 = 215 → 35h = 175 → h = 5.',
            },
            {
              id: 'bb-m1-ex4-q4',
              text: '4. Un concurrent facture 50 € de frais fixes + 30 € par heure. À partir de combien d\'heures le premier plombier est-il moins cher ?',
              points: 6,
              answer: 'Plus de 2 heures',
              methodology: '35h + 40 < 30h + 50 → 5h < 10 → h < 2. Pour h < 2, le plombier 1 est moins cher. Pour h > 2, c\'est le plombier 2.',
            },
          ],
        },
        {
          id: 'bb-m1-ex5',
          title: 'Exercice 5 — Algorithmique et Python',
          points: 20,
          statement: '',
          questions: [
            {
              id: 'bb-m1-ex5-q1',
              text: '1. Voici un programme Python :\n```python\nn = 0\nfor i in range(1, 11):\n    if i % 2 == 0:\n        n = n + i\nprint(n)\n```\nQue fait ce programme ? Donnez le résultat affiché.',
              points: 6,
              answer: '30. Le programme calcule la somme des entiers pairs de 1 à 10 : 2+4+6+8+10 = 30.',
              methodology: 'La condition i % 2 == 0 sélectionne les nombres pairs.',
            },
            {
              id: 'bb-m1-ex5-q2',
              text: '2. Écrivez un programme Python qui affiche la table de multiplication de 7 (de 7×1 à 7×10).',
              points: 8,
              answer: 'for i in range(1, 11):\n    print(f"7 × {i} = {7*i}")',
              methodology: 'Boucle for sur range(1, 11), afficher 7*i à chaque itération.',
            },
            {
              id: 'bb-m1-ex5-q3',
              text: '3. Une suite est définie par u₀ = 1 et pour tout n ≥ 0, u_{n+1} = 2u_n + 1. Écrivez un programme Python calculant et affichant les 6 premiers termes (u₀ à u₅).',
              points: 6,
              answer: 'u = 1\nprint(u)\nfor i in range(5):\n    u = 2*u + 1\n    print(u)',
              methodology: 'Initialiser u=1, afficher, puis boucler 5 fois en appliquant la relation de récurrence.',
            },
          ],
        },
      ],
    },
  ],
};
