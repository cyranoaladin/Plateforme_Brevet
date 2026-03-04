import { ExamDefinition } from "@/types/exams";

export const EXAMS_V1: ExamDefinition[] = [
  {
    id: "maths-dnb-2026",
    title: "Sujet Officiel Maths - Session 2026",
    subject: "maths",
    duration: 120, // 2h
    energyCost: 10,
    xpReward: 500,
    sections: [
      {
        id: "ex1",
        title: "Exercice 1 : Arithmétique et Algèbre (20 pts)",
        points: 20,
        questions: [
          {
            id: "q1",
            type: "qcm",
            bloom: "N2_COMPREHENSION",
            difficulty: "MOYEN",
            question: "L'expression factorisée de (x+3)^2 - 25 est :",
            options: ["(x-2)(x+8)", "(x+2)(x-8)", "(x+3)(x-5)", "(x-22)^2"],
            correctAnswer: 0,
            explanation: "C'est une identité remarquable a^2 - b^2 avec a=(x+3) et b=5."
          }
        ]
      }
    ]
  }
];
