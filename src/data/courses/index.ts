// src/data/courses/index.ts

export interface CourseExample {
  statement: string;
  solution: string;
}

export interface Course {
  id: string;
  chapterId: string;
  title: string;
  summary: string;
  keyPoints: string[];
  formulas?: string[];
  examples: CourseExample[];
  commonMistakes: string[];
}

export const COURSES: Course[] = [
  // ─── MATHS ───────────────────────────────────────────────────────
  {
    id: 'cours-pythagore',
    chapterId: 'maths-geometrie-plane',
    title: 'Théorème de Pythagore',
    summary: 'Dans un triangle rectangle, le carré de l\'hypoténuse est égal à la somme des carrés des deux autres côtés. C\'est le théorème le plus utilisé en géométrie au brevet.',
    keyPoints: [
      'S\'applique UNIQUEMENT dans un triangle rectangle.',
      'L\'hypoténuse est le côté le plus long, opposé à l\'angle droit.',
      'Formule : AC² = AB² + BC² (si l\'angle droit est en B).',
      'Réciproque : si AC² = AB² + BC², alors le triangle est rectangle en B.',
      'Contraposée : si AC² ≠ AB² + BC², le triangle n\'est PAS rectangle en B.',
    ],
    formulas: ['AC^2 = AB^2 + BC^2'],
    examples: [
      {
        statement: 'AB = 3 cm, BC = 4 cm, angle droit en B. Calcule AC.',
        solution: 'AC² = 9 + 16 = 25, donc AC = 5 cm.',
      },
      {
        statement: 'Un triangle a les côtés 5, 12 et 13. Est-il rectangle ?',
        solution: '5² + 12² = 25 + 144 = 169 = 13². Oui, il est rectangle (angle droit opposé au côté 13).',
      },
    ],
    commonMistakes: [
      'Oublier que le théorème ne s\'applique qu\'aux triangles rectangles.',
      'Confondre l\'hypoténuse avec un côté quelconque.',
      'Oublier de prendre la racine carrée à la fin.',
    ],
  },

  {
    id: 'cours-thales',
    chapterId: 'maths-geometrie-plane',
    title: 'Théorème de Thalès',
    summary: 'Si deux droites sont coupées par deux sécantes parallèles, les rapports des longueurs correspondantes sont égaux. Très utilisé pour calculer des longueurs inconnues.',
    keyPoints: [
      'Les droites BC et DE doivent être parallèles.',
      'Le point A est sur les deux sécantes (AB et AD ou AE).',
      'Rapport : AB/AD = AC/AE = BC/DE.',
      'La réciproque : si les rapports sont égaux, alors les droites sont parallèles.',
      'Cas particulier : théorème des milieux (rapport = 1/2).',
    ],
    formulas: ['\\frac{AB}{AD} = \\frac{AC}{AE} = \\frac{BC}{DE}'],
    examples: [
      {
        statement: 'AB = 4 cm, AD = 6 cm, BC = 3 cm. BC ∥ DE. Calcule DE.',
        solution: 'AB/AD = BC/DE → 4/6 = 3/DE → DE = (3 × 6)/4 = 4,5 cm.',
      },
    ],
    commonMistakes: [
      'Mal identifier quel point est le sommet des sécantes.',
      'Ne pas vérifier que les droites sont bien parallèles avant d\'appliquer le théorème.',
      'Inverser numérateur et dénominateur dans le rapport.',
    ],
  },

  {
    id: 'cours-fonctions-affines',
    chapterId: 'maths-fonctions',
    title: 'Fonctions linéaires et affines',
    summary: 'Une fonction affine est de la forme f(x) = ax + b. Elle se représente par une droite. a est le coefficient directeur (pente) et b est l\'ordonnée à l\'origine.',
    keyPoints: [
      'Fonction linéaire : f(x) = ax (b = 0), la droite passe par l\'origine.',
      'Fonction affine : f(x) = ax + b.',
      'Coefficient directeur a : variation de y pour +1 en x. Si a > 0 : croissante. Si a < 0 : décroissante.',
      'Ordonnée à l\'origine b : valeur de f(0), là où la droite coupe l\'axe y.',
      'Pour tracer la droite : calculer f(0) = b et f(1) = a + b, puis relier.',
    ],
    formulas: ['f(x) = ax + b', 'a = \\frac{y_B - y_A}{x_B - x_A}'],
    examples: [
      {
        statement: 'Trace la droite d\'équation y = 2x − 3.',
        solution: 'f(0) = −3 → point (0;−3). f(2) = 1 → point (2;1). On relie ces deux points.',
      },
    ],
    commonMistakes: [
      'Confondre a (coefficient directeur) et b (ordonnée à l\'origine).',
      'Oublier que la droite est décroissante si a < 0.',
    ],
  },

  // ─── FRANÇAIS ────────────────────────────────────────────────────
  {
    id: 'cours-figures-style',
    chapterId: 'fr-figures-style',
    title: 'Les principales figures de style',
    summary: 'Les figures de style sont des procédés d\'écriture qui donnent de l\'expressivité au texte. Il est essentiel de les identifier et de les nommer correctement au brevet.',
    keyPoints: [
      'Métaphore : comparaison sans outil comparatif ("Ses yeux sont des étoiles").',
      'Comparaison : avec outil comparatif comme/tel/pareil à ("Il est courageux comme un lion").',
      'Personnification : on attribue des caractéristiques humaines à un objet ou animal.',
      'Hyperbole : exagération pour impressionner ("Je meurs de rire").',
      'Anaphore : répétition d\'un mot ou groupe de mots en début de phrases.',
      'Antithèse : opposition de deux termes contraires dans la même phrase.',
      'Oxymore : association de deux termes contradictoires ("un silence assourdissant").',
      'Allitération : répétition de sons consonantiques ("Pour qui sont ces serpents qui sifflent...").',
    ],
    examples: [
      {
        statement: 'Identifie la figure dans : "La neige dansait sous le vent."',
        solution: 'Personnification : la neige (chose) "danse" comme un être humain.',
      },
      {
        statement: '"Rome, l\'unique objet de mon ressentiment !" (Corneille) : quelle figure ?',
        solution: 'Apostrophe (interpellation directe) + hyperbole implicite.',
      },
    ],
    commonMistakes: [
      'Confondre métaphore (sans outil) et comparaison (avec outil).',
      'Nommer la figure sans l\'expliquer dans son effet sur le lecteur.',
      'Oublier de citer le passage exact du texte.',
    ],
  },

  {
    id: 'cours-accord-participe',
    chapterId: 'fr-dictee',
    title: 'Accord du participe passé',
    summary: 'L\'accord du participe passé dépend de l\'auxiliaire utilisé et de la position du COD.',
    keyPoints: [
      'Avec "être" : le participe s\'accorde avec le sujet (genre et nombre).',
      'Avec "avoir" : le participe s\'accorde avec le COD placé AVANT le verbe.',
      'Avec "avoir" + COD après : PAS d\'accord ("Elle a mangé une pomme").',
      'Verbes pronominaux : accord avec le sujet en général.',
      'Exceptions : "se" est COI → pas d\'accord ("Elle s\'est dit la vérité").',
    ],
    examples: [
      {
        statement: '"Les lettres qu\'elle a écrites." Justifie l\'accord.',
        solution: '"Qu\'" remplace "lettres" (COD féminin pluriel), placé AVANT "a écrites" → accord : écrites.',
      },
      {
        statement: '"Elle est partie tôt." Justifie l\'accord.',
        solution: 'Auxiliaire "être" → accord avec le sujet "elle" (féminin singulier) → partie.',
      },
    ],
    commonMistakes: [
      'Accorder avec avoir quand le COD est après le verbe.',
      'Ne pas repérer que le COD est un pronom relatif "que" placé avant.',
    ],
  },

  // ─── HISTOIRE-GÉO ────────────────────────────────────────────────
  {
    id: 'cours-ww2-resume',
    chapterId: 'hg-ww2',
    title: 'La Seconde Guerre mondiale — repères essentiels',
    summary: 'La WW2 (1939-1945) est le conflit le plus meurtrier de l\'histoire avec 60 millions de morts. Elle voit la défaite de la France (1940), l\'occupation nazie, et la Shoah.',
    keyPoints: [
      '1er septembre 1939 : invasion de la Pologne par l\'Allemagne → début de la WW2.',
      'Juin 1940 : défaite et armistice de la France. Zone occupée vs zone libre.',
      '18 juin 1940 : Appel du Général de Gaulle depuis Londres.',
      'Gouvernement de Vichy : régime collaborationniste du Maréchal Pétain.',
      'La Shoah : génocide systématique de 6 millions de Juifs d\'Europe.',
      '6 juin 1944 : Débarquement en Normandie ("Jour J").',
      '8 mai 1945 : capitulation de l\'Allemagne (Victoire en Europe).',
      '6 et 9 août 1945 : bombes atomiques sur Hiroshima et Nagasaki.',
      '2 septembre 1945 : capitulation du Japon → fin de la WW2.',
    ],
    examples: [
      {
        statement: 'Pourquoi parle-t-on de "guerre totale" ?',
        solution: 'Car elle mobilise toutes les ressources humaines et économiques des États, touche les civils autant que les soldats, et utilise toutes les technologies disponibles (aviation, chars, bombe atomique).',
      },
    ],
    commonMistakes: [
      'Confondre armistice de 1918 (WW1) avec celui de 1940 (WW2).',
      'Croire que toute la France a collaboré : la Résistance était active.',
    ],
  },

  // ─── SCIENCES ────────────────────────────────────────────────────
  {
    id: 'cours-loi-ohm',
    chapterId: 'sci-electricite',
    title: 'Loi d\'Ohm et circuits électriques',
    summary: 'La loi d\'Ohm relie tension, intensité et résistance dans un circuit. En série, l\'intensité est la même partout. En dérivation, la tension est la même aux bornes de chaque branche.',
    keyPoints: [
      'Loi d\'Ohm : U = R × I (U en V, R en Ω, I en A).',
      'Circuit en série : I identique partout ; U_totale = U_1 + U_2 + ...',
      'Circuit en dérivation : U identique pour chaque branche ; I_totale = I_1 + I_2 + ...',
      'Puissance électrique : P = U × I (en watts).',
      'Énergie consommée : E = P × t (en joules ou kWh).',
    ],
    formulas: ['U = R \\times I', 'P = U \\times I', 'E = P \\times t'],
    examples: [
      {
        statement: 'R = 100 Ω, U = 12 V. Calcule I.',
        solution: 'I = U/R = 12/100 = 0,12 A = 120 mA.',
      },
    ],
    commonMistakes: [
      'Confondre les lois des circuits en série et en dérivation.',
      'Oublier de convertir les unités (mA en A, kΩ en Ω).',
    ],
  },
];

/**
 * Retrieve a course by its unique ID.
 */
export const getCourseById = (id: string): Course | undefined =>
  COURSES.find(c => c.id === id);

/**
 * Retrieve all courses for a given chapter ID.
 */
export const getCoursesByChapter = (chapterId: string): Course[] =>
  COURSES.filter(c => c.chapterId === chapterId);
