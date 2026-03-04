import { ContentPack } from "./curriculum";
import { FrenchExercise } from "./francais";
import { HgEmcContentPack } from "./hg_emc";
import { ScienceExercise } from "./sciences";

export interface FrenchExercisePack {
  version: string;
  subject: 'francais';
  lastUpdated: string;
  exercises: FrenchExercise[];
}

export interface ScienceExercisePack {
  version: string;
  subject: 'sciences';
  lastUpdated: string;
  exercises: ScienceExercise[];
}

export type RegistryEntry = 
  | { kind: 'notions'; pack: ContentPack }
  | { kind: 'exercises'; pack: FrenchExercisePack }
  | { kind: 'hg_emc'; pack: HgEmcContentPack }
  | { kind: 'sciences'; pack: ScienceExercisePack };

export type PackUnion = RegistryEntry; // Alias pour compatibilité

export type SubjectId = 'maths' | 'francais' | 'hg_emc' | 'sciences';
