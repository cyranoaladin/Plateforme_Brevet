import { NextResponse } from "next/server";
import { VectorStoreService } from "@/services/aria/vectorStore";

export async function POST() {
  try {
    const fakeChunks = [
      {
        id: "1",
        text: "Le théorème de Thalès permet de calculer des longueurs dans un triangle. Il faut des droites parallèles.",
        source: "BO Maths 2024",
        subject: "maths",
        notionId: "thales",
        year: 2024,
        docType: "BO"
      },
      {
        id: "2",
        text: "La réciproque de Thalès sert à démontrer que deux droites sont parallèles.",
        source: "Fiche Eduscol",
        subject: "maths",
        notionId: "thales",
        year: 2023,
        docType: "Fiche"
      },
      {
        id: "3",
        text: "L'accord du participe passé avec l'auxiliaire avoir se fait avec le COD si celui-ci est placé avant le verbe.",
        source: "BO Français 2024",
        subject: "francais",
        notionId: "grammaire",
        year: 2024,
        docType: "BO"
      }
    ];

    await VectorStoreService.upsertChunks(fakeChunks);
    return NextResponse.json({ message: "Seed successful", count: fakeChunks.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
