// src/data/flashcards/index.ts
export interface Flashcard {
  id: string;
  subjectSlug: string;
  chapterId: string;
  front: string;
  back: string;
  tags: string[];
  difficulty: 1 | 2 | 3;
}

export const FLASHCARDS: Flashcard[] = [
  // ─── MATHS ───────────────────────────────────────────────────────
  { id: 'fc-m-001', subjectSlug: 'maths', chapterId: 'maths-geometrie-plane', front: 'Énonce le théorème de Pythagore', back: 'Dans un triangle ABC rectangle en B : AC² = AB² + BC²', tags: ['Pythagore'], difficulty: 1 },
  { id: 'fc-m-002', subjectSlug: 'maths', chapterId: 'maths-geometrie-plane', front: 'Qu\'est-ce que la réciproque de Pythagore ?', back: 'Si AC² = AB² + BC², alors le triangle ABC est rectangle en B.', tags: ['Pythagore','réciproque'], difficulty: 2 },
  { id: 'fc-m-003', subjectSlug: 'maths', chapterId: 'maths-geometrie-plane', front: 'sin(30°) = ?', back: 'sin(30°) = 1/2 = 0,5', tags: ['trigonométrie','valeurs remarquables'], difficulty: 1 },
  { id: 'fc-m-004', subjectSlug: 'maths', chapterId: 'maths-geometrie-plane', front: 'cos(60°) = ?', back: 'cos(60°) = 1/2 = 0,5', tags: ['trigonométrie','valeurs remarquables'], difficulty: 1 },
  { id: 'fc-m-005', subjectSlug: 'maths', chapterId: 'maths-fonctions', front: 'Forme générale d\'une fonction affine', back: 'f(x) = ax + b, où a est le coefficient directeur et b l\'ordonnée à l\'origine', tags: ['fonction affine'], difficulty: 1 },
  { id: 'fc-m-006', subjectSlug: 'maths', chapterId: 'maths-calcul-litteral', front: 'Développe (a+b)² (identité remarquable)', back: 'a² + 2ab + b²', tags: ['identité remarquable'], difficulty: 2 },
  { id: 'fc-m-007', subjectSlug: 'maths', chapterId: 'maths-calcul-litteral', front: 'Développe (a−b)²', back: 'a² − 2ab + b²', tags: ['identité remarquable'], difficulty: 2 },
  { id: 'fc-m-008', subjectSlug: 'maths', chapterId: 'maths-calcul-litteral', front: 'Factorise a² − b²', back: '(a−b)(a+b)', tags: ['différence de carrés','factorisation'], difficulty: 2 },
  { id: 'fc-m-009', subjectSlug: 'maths', chapterId: 'maths-geometrie-espace', front: 'Volume d\'une sphère de rayon r', back: 'V = (4/3)πr³', tags: ['volume','sphère'], difficulty: 2 },
  { id: 'fc-m-010', subjectSlug: 'maths', chapterId: 'maths-geometrie-espace', front: 'Volume d\'un cylindre de rayon r et hauteur h', back: 'V = πr²h', tags: ['volume','cylindre'], difficulty: 2 },
  { id: 'fc-m-011', subjectSlug: 'maths', chapterId: 'maths-geometrie-espace', front: 'Volume d\'un cône de rayon r et hauteur h', back: 'V = (1/3)πr²h', tags: ['volume','cône'], difficulty: 2 },
  { id: 'fc-m-012', subjectSlug: 'maths', chapterId: 'maths-statistiques', front: 'Comment calcule-t-on la médiane d\'une série ?', back: 'On ordonne les valeurs. La médiane est la valeur centrale. Si n pair : moyenne des deux valeurs centrales.', tags: ['médiane','statistiques'], difficulty: 2 },

  // ─── FRANÇAIS ────────────────────────────────────────────────────
  { id: 'fc-fr-001', subjectSlug: 'francais', chapterId: 'fr-figures-style', front: 'Définition de la métaphore', back: 'Comparaison directe SANS outil comparatif. Ex : "Ses yeux sont des étoiles."', tags: ['métaphore','figure de style'], difficulty: 1 },
  { id: 'fc-fr-002', subjectSlug: 'francais', chapterId: 'fr-figures-style', front: 'Différence entre métaphore et comparaison', back: 'Comparaison : avec outil (comme, tel que...). Métaphore : sans outil comparatif.', tags: ['métaphore','comparaison'], difficulty: 2 },
  { id: 'fc-fr-003', subjectSlug: 'francais', chapterId: 'fr-figures-style', front: 'Qu\'est-ce qu\'une hyperbole ?', back: 'Exagération destinée à frapper le lecteur. Ex : "Je meurs de rire", "J\'ai une faim de loup."', tags: ['hyperbole'], difficulty: 1 },
  { id: 'fc-fr-004', subjectSlug: 'francais', chapterId: 'fr-figures-style', front: 'Qu\'est-ce qu\'un oxymore ?', back: 'Association de deux termes contradictoires. Ex : "un silence assourdissant", "une obscure clarté".', tags: ['oxymore'], difficulty: 2 },
  { id: 'fc-fr-005', subjectSlug: 'francais', chapterId: 'fr-conjugaison', front: 'Terminaisons du passé simple pour les verbes en -er (3e pers. sg/pl)', back: '3e pers. sg : -a (il parla) ; 3e pers. pl : -èrent (ils parlèrent)', tags: ['passé simple','conjugaison'], difficulty: 2 },
  { id: 'fc-fr-006', subjectSlug: 'francais', chapterId: 'fr-grammaire', front: 'Qu\'est-ce qu\'un COD ?', back: 'Complément d\'Objet Direct : répond à la question QUOI ou QUI après le verbe (sans préposition).', tags: ['COD','complément'], difficulty: 1 },
  { id: 'fc-fr-007', subjectSlug: 'francais', chapterId: 'fr-grammaire', front: 'Qu\'est-ce qu\'un COI ?', back: 'Complément d\'Objet Indirect : répond à la question À QUI / À QUOI / DE QUI (avec préposition à ou de).', tags: ['COI','complément'], difficulty: 1 },
  { id: 'fc-fr-008', subjectSlug: 'francais', chapterId: 'fr-lexique', front: 'Que signifie le préfixe "poly-" ?', back: '"Poly-" vient du grec et signifie "plusieurs, nombreux". Ex : polygone, polyglotte, polymorphe.', tags: ['préfixe','étymologie'], difficulty: 1 },

  // ─── HISTOIRE-GÉO ───────────────────────────────────────────────
  { id: 'fc-hg-001', subjectSlug: 'histoire_geo', chapterId: 'hg-ww1', front: 'Date de l\'armistice de la WW1', back: '11 novembre 1918, à 11h (11e heure du 11e jour du 11e mois).', tags: ['1918','armistice','WW1'], difficulty: 1 },
  { id: 'fc-hg-002', subjectSlug: 'histoire_geo', chapterId: 'hg-ww2', front: 'Date du Débarquement de Normandie', back: '6 juin 1944 ("Jour J") sur les plages normandes.', tags: ['Débarquement','1944','WW2'], difficulty: 1 },
  { id: 'fc-hg-003', subjectSlug: 'histoire_geo', chapterId: 'hg-ww2', front: 'Qu\'est-ce que la Shoah ?', back: 'Le génocide systématique de 6 millions de Juifs d\'Europe par les nazis (1942-1945).', tags: ['Shoah','génocide','nazisme'], difficulty: 1 },
  { id: 'fc-hg-004', subjectSlug: 'histoire_geo', chapterId: 'hg-guerre-froide', front: 'Quand est construit et quand tombe le mur de Berlin ?', back: 'Construit le 13 août 1961 ; tombé le 9 novembre 1989.', tags: ['Berlin','mur','guerre froide'], difficulty: 1 },
  { id: 'fc-hg-005', subjectSlug: 'histoire_geo', chapterId: 'emc-republique', front: 'Quels sont les 5 principes fondamentaux de la République française ?', back: 'République une et indivisible, laïque, démocratique, sociale, irremplaçable. Devise : Liberté, Égalité, Fraternité.', tags: ['République','valeurs','laïcité'], difficulty: 2 },

  // ─── SCIENCES ────────────────────────────────────────────────────
  { id: 'fc-sc-001', subjectSlug: 'sciences', chapterId: 'sci-electricite', front: 'Énoncer la loi d\'Ohm', back: 'U = R × I (tension en V = résistance en Ω × intensité en A)', tags: ['Ohm','loi','électricité'], difficulty: 1 },
  { id: 'fc-sc-002', subjectSlug: 'sciences', chapterId: 'sci-mecanique', front: 'Formule du poids', back: 'P = m × g (poids en N, masse en kg, g = 9,8 ou 10 N/kg)', tags: ['poids','masse','Newton'], difficulty: 1 },
  { id: 'fc-sc-003', subjectSlug: 'sciences', chapterId: 'sci-svt-genetique', front: 'Où se trouve l\'ADN dans une cellule animale ?', back: 'Principalement dans le noyau (ADN chromosomique) et dans les mitochondries (ADN mitochondrial).', tags: ['ADN','noyau','cellule'], difficulty: 2 },
  { id: 'fc-sc-004', subjectSlug: 'sciences', chapterId: 'sci-chimie-matiere', front: 'Formule chimique de l\'eau', back: 'H₂O : 2 atomes d\'hydrogène + 1 atome d\'oxygène', tags: ['eau','H2O','formule'], difficulty: 1 },
  { id: 'fc-sc-005', subjectSlug: 'sciences', chapterId: 'sci-chimie-matiere', front: 'Formule du dioxyde de carbone', back: 'CO₂ : 1 atome de carbone + 2 atomes d\'oxygène', tags: ['CO2','formule'], difficulty: 1 },
];

/**
 * Retrieve flashcards by subject slug.
 */
export const getFlashcardsBySubject = (subjectSlug: string): Flashcard[] =>
  FLASHCARDS.filter(f => f.subjectSlug === subjectSlug);

/**
 * Retrieve flashcards by chapter ID.
 */
export const getFlashcardsByChapter = (chapterId: string): Flashcard[] =>
  FLASHCARDS.filter(f => f.chapterId === chapterId);
