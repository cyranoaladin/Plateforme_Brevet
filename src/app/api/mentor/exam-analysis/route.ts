import { NextResponse } from "next/server";
import { ExamSummarySchema, AriaRevisionPlan, AriaAction } from "@/services/aria/examTypes";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const summary = ExamSummarySchema.parse(body.examSummary);
    
    // Logique Produit : Déterminer les priorités
    const notionsRatées = Object.keys(summary.mistakesByNotion);
    const actions: AriaAction[] = [];

    // Priorité 1 : La notion la plus ratée
    if (notionsRatées.length > 0) {
      actions.push({
        label: `Renforcer ${notionsRatées[0]}`,
        description: "Tu as fait plusieurs erreurs sur cette notion. Une relecture de la leçon s'impose.",
        route: `/learn/${summary.subject}/${notionsRatées[0]}`,
        priority: "HAUTE"
      });
    }

    // Priorité 2 : Temps ou Score global
    if (summary.score20 < 10) {
      actions.push({
        label: "Bases de l'arithmétique",
        description: "Reprends les automatismes fondamentaux pour sécuriser les points faciles.",
        route: "/learn/maths/automatismes",
        priority: "HAUTE"
      });
    } else if (summary.timeSpentMinutes < 30) {
      actions.push({
        label: "Atelier Gestion du temps",
        description: "Tu as fini très vite. Apprends à relire ta copie pour éviter les fautes d'inattention.",
        route: "/mentor",
        priority: "MOYENNE"
      });
    }

    // Priorité 3 : Challenge
    if (summary.score20 >= 15) {
      actions.push({
        label: "Défi Expert DNB",
        description: "Excellent score ! Tente un sujet de niveau mention Très Bien.",
        route: "/exams",
        priority: "BASSE"
      });
    }

    const plan: AriaRevisionPlan = {
      analysis: `Examen terminé avec une note de ${summary.score20}/20. ${notionsRatées.length > 0 ? "Certaines notions comme " + notionsRatées.join(", ") + " demandent encore du travail." : "Belle maîtrise globale !"}`,
      actions: actions.slice(0, 3),
      confidence: 0.9
    };

    return NextResponse.json(plan);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
