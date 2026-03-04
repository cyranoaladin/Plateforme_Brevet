export interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  energyCost: number;
  xpReward: number;
  gemsReward: number;
  questions: Question[];
}

export const MATHS_QUIZZES: Quiz[] = [
  {
    id: "thales",
    title: "Théorème de Thalès",
    subject: "Mathématiques",
    energyCost: 2,
    xpReward: 25,
    gemsReward: 5,
    questions: [
      {
        id: 1,
        question: "Dans quelle configuration peut-on appliquer le théorème de Thalès ?",
        options: [
          "Dans n'importe quel triangle.",
          "Dans deux droites sécantes coupées par deux droites parallèles.",
          "Uniquement dans un triangle rectangle.",
          "Dans un cercle inscrit."
        ],
        correct: 1,
      },
      {
        id: 2,
        question: "Si AM/AB = AN/AC, que peut-on dire des droites (MN) et (BC) ?",
        options: [
          "Elles sont perpendiculaires.",
          "Elles sont sécantes.",
          "Elles sont parallèles (Réciproque de Thalès).",
          "Elles sont confondues."
        ],
        correct: 2,
      }
    ]
  }
];
