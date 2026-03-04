import { ContentPack, Notion } from '@/types/curriculum';
import { FrenchExercise } from '@/types/francais';
import { HgEmcContentPack, HgEmcActivity } from '@/types/hg_emc';
import { ScienceExercise } from '@/types/sciences';
import { RegistryEntry, FrenchExercisePack, ScienceExercisePack } from '@/types/registry';

/**
 * REGISTRY DES CONTENUS (ASYNC & DYNAMIC IMPORTS)
 * Optimise le bundle en chargeant les JSON uniquement à la demande.
 */

export async function getPack(subjectId: string): Promise<RegistryEntry | null> {
  try {
    switch (subjectId) {
      case 'maths':
        const mathsV1 = await import('./v1/maths.json');
        return { kind: 'notions', pack: mathsV1.default as ContentPack };
      case 'francais':
        const francaisV1 = await import('./v1/francais.json');
        return { kind: 'exercises', pack: francaisV1.default as FrenchExercisePack };
      case 'hg_emc':
        const hgEmcV1 = await import('./v1/hg_emc.json');
        return { kind: 'hg_emc', pack: hgEmcV1.default as HgEmcContentPack };
      case 'sciences':
        const sciencesV1 = await import('./v1/sciences.json');
        return { kind: 'sciences', pack: sciencesV1.default as ScienceExercisePack };
      default:
        return null;
    }
  } catch (error) {
    console.error(`[REGISTRY] Error loading pack ${subjectId}:`, error);
    return null;
  }
}

export async function getNotion(subjectId: string, notionId: string): Promise<Notion | null> {
  const entry = await getPack(subjectId);
  if (!entry || entry.kind !== 'notions') return null;
  return entry.pack.notions.find((n) => n.id === notionId) || null;
}

export async function getFrenchExercise(id: string): Promise<FrenchExercise | null> {
  const entry = await getPack('francais');
  if (!entry || entry.kind !== 'exercises') return null;
  return entry.pack.exercises.find((e) => e.id === id) || null;
}

export async function getHgEmcActivity(id: string): Promise<HgEmcActivity | null> {
  const entry = await getPack('hg_emc');
  if (!entry || entry.kind !== 'hg_emc') return null;
  return entry.pack.activities.find((a) => a.id === id) || null;
}

export async function getScienceExercise(id: string): Promise<ScienceExercise | null> {
  const entry = await getPack('sciences');
  if (!entry || entry.kind !== 'sciences') return null;
  return entry.pack.exercises.find((e) => e.id === id) || null;
}

export async function getAllNotionsBySubject(subjectId: string): Promise<Notion[]> {
  const entry = await getPack(subjectId);
  return entry && entry.kind === 'notions' ? entry.pack.notions : [];
}

export async function getAllFrenchExercises(): Promise<FrenchExercise[]> {
  const entry = await getPack('francais');
  return entry && entry.kind === 'exercises' ? entry.pack.exercises : [];
}

export async function getAllHgEmcActivities(): Promise<HgEmcActivity[]> {
  const entry = await getPack('hg_emc');
  return entry && entry.kind === 'hg_emc' ? entry.pack.activities : [];
}

export async function getAllScienceExercises(): Promise<ScienceExercise[]> {
  const entry = await getPack('sciences');
  return entry && entry.kind === 'sciences' ? entry.pack.exercises : [];
}

export function getAllSubjects(): string[] {
  return ['maths', 'francais', 'hg_emc', 'sciences'];
}
