// src/lib/curriculum/subjects.ts
export type SubjectSlug =
  | 'maths'
  | 'francais'
  | 'histoire_geo'
  | 'emc'
  | 'sciences'
  | 'lv1'
  | 'technologie';

export interface Chapter {
  id: string;
  title: string;
  description: string;
  bloomLevel: 1 | 2 | 3 | 4 | 5 | 6; // Remembering→Creating
  keywords: string[];
  estimatedMinutes: number;
}

export interface Subject {
  slug: SubjectSlug;
  label: string;
  emoji: string;
  color: string;
  colorDark: string;
  coef: number;
  pointsMax: number;
  description: string;
  chapters: Chapter[];
}

export const SUBJECTS: Subject[] = [
  {
    slug: 'maths',
    label: 'Mathématiques',
    emoji: '📐',
    color: '#3B82F6',
    colorDark: '#1D4ED8',
    coef: 2,
    pointsMax: 100,
    description: 'Arithmétique, algèbre, géométrie, statistiques et algorithmique.',
    chapters: [
      {
        id: 'maths-automatismes',
        title: 'Automatismes (sans calculatrice)',
        description: 'Calcul mental rapide : fractions, pourcentages, conversions, moyennes, médianes, propriétés géométriques fondamentales.',
        bloomLevel: 2,
        keywords: ['fraction','pourcentage','conversion','moyenne','médiane','PGCD','PPCM'],
        estimatedMinutes: 30,
      },
      {
        id: 'maths-arithmetique',
        title: 'Arithmétique & Nombres',
        description: 'Nombres entiers, rationnels, relatifs. Nombres premiers, décomposition en facteurs. Divisibilité.',
        bloomLevel: 3,
        keywords: ['nombre premier','facteur','divisibilité','entier','rationnel','relatif'],
        estimatedMinutes: 45,
      },
      {
        id: 'maths-calcul-litteral',
        title: 'Calcul littéral & Équations',
        description: 'Développer, factoriser, réduire. Équations du 1er degré. Systèmes d\'équations.',
        bloomLevel: 3,
        keywords: ['équation','développer','factoriser','réduire','système','inéquation'],
        estimatedMinutes: 60,
      },
      {
        id: 'maths-fonctions',
        title: 'Fonctions',
        description: 'Fonctions linéaires et affines : tableau de valeurs, représentation graphique, lecture graphique, coefficient directeur.',
        bloomLevel: 3,
        keywords: ['fonction','linéaire','affine','tableau de valeurs','graphique','coefficient directeur','ordonnée à l\'origine'],
        estimatedMinutes: 60,
      },
      {
        id: 'maths-geometrie-plane',
        title: 'Géométrie plane',
        description: 'Théorème de Thalès, réciproque. Théorème de Pythagore, réciproque. Trigonométrie (sin, cos, tan). Triangles, cercles, droites parallèles.',
        bloomLevel: 4,
        keywords: ['Thalès','Pythagore','trigonométrie','sinus','cosinus','tangente','homothétie','parallèles'],
        estimatedMinutes: 90,
      },
      {
        id: 'maths-geometrie-espace',
        title: 'Géométrie dans l\'espace',
        description: 'Volumes : cube, pavé droit, pyramide, cône, sphère, cylindre. Sections planes.',
        bloomLevel: 3,
        keywords: ['volume','cube','pavé','pyramide','cône','sphère','cylindre','section'],
        estimatedMinutes: 60,
      },
      {
        id: 'maths-statistiques',
        title: 'Statistiques & Probabilités',
        description: 'Moyenne, médiane, étendue. Probabilités : expérience aléatoire, événement, fréquence, loi des grands nombres.',
        bloomLevel: 3,
        keywords: ['statistiques','probabilité','moyenne','médiane','étendue','événement','fréquence'],
        estimatedMinutes: 45,
      },
      {
        id: 'maths-algorithmique',
        title: 'Algorithmique & Python',
        description: 'Notion d\'algorithme. Variables, boucles, conditions. Programmation Scratch et Python basique.',
        bloomLevel: 3,
        keywords: ['algorithme','variable','boucle','condition','Python','Scratch','instruction'],
        estimatedMinutes: 60,
      },
    ],
  },

  {
    slug: 'francais',
    label: 'Français',
    emoji: '📚',
    color: '#EF4444',
    colorDark: '#B91C1C',
    coef: 2,
    pointsMax: 100,
    description: 'Langue française, littérature, rédaction et expression écrite.',
    chapters: [
      {
        id: 'fr-grammaire',
        title: 'Grammaire & Classes grammaticales',
        description: 'Noms, verbes, adjectifs, adverbes, pronoms, déterminants, prépositions. Fonctions : sujet, COD, COI, attribut, complément circonstanciel.',
        bloomLevel: 2,
        keywords: ['nom','verbe','adjectif','adverbe','pronom','déterminant','sujet','COD','COI','attribut'],
        estimatedMinutes: 60,
      },
      {
        id: 'fr-conjugaison',
        title: 'Conjugaison & Valeurs des temps',
        description: 'Présent, imparfait, passé simple, passé composé, futur, conditionnel, subjonctif. Valeurs aspectuelles et modales. Concordance des temps.',
        bloomLevel: 3,
        keywords: ['présent','imparfait','passé simple','passé composé','futur','conditionnel','subjonctif','temps','mode'],
        estimatedMinutes: 75,
      },
      {
        id: 'fr-syntaxe',
        title: 'Syntaxe & Phrase complexe',
        description: 'Phrase simple vs complexe. Juxtaposition, coordination, subordination. Propositions relatives, complétives, circonstancielles.',
        bloomLevel: 3,
        keywords: ['phrase','juxtaposition','coordination','subordination','relative','complétive','circonstancielle'],
        estimatedMinutes: 60,
      },
      {
        id: 'fr-lexique',
        title: 'Lexique & Vocabulaire',
        description: 'Formation des mots (préfixe, suffixe, radical). Familles de mots. Champ lexical et sémantique. Sens propre et figuré. Registres de langue.',
        bloomLevel: 2,
        keywords: ['préfixe','suffixe','radical','famille de mots','champ lexical','sens propre','sens figuré','registre'],
        estimatedMinutes: 45,
      },
      {
        id: 'fr-figures-style',
        title: 'Figures de style & Procédés littéraires',
        description: 'Métaphore, comparaison, personnification, hyperbole, anaphore, antithèse, oxymore, allitération, assonance, chiasme, euphémisme.',
        bloomLevel: 3,
        keywords: ['métaphore','comparaison','personnification','hyperbole','anaphore','antithèse','oxymore','allitération'],
        estimatedMinutes: 45,
      },
      {
        id: 'fr-comprehension',
        title: 'Compréhension & Analyse de texte',
        description: 'Dégager les idées principales. Repérer le point de vue du narrateur. Identifier le registre (lyrique, épique, tragique, comique, polémique). Analyser l\'implicite.',
        bloomLevel: 4,
        keywords: ['compréhension','narrateur','registre','lyrique','épique','tragique','implicite','inférence'],
        estimatedMinutes: 90,
      },
      {
        id: 'fr-redaction',
        title: 'Rédaction & Expression écrite',
        description: 'Sujet d\'imagination : conte, dialogue, lettre, article de presse, récit. Sujet de réflexion : argumentation structurée, introduction, développement, conclusion.',
        bloomLevel: 6,
        keywords: ['rédaction','imaginaire','réflexion','argumentation','plan','introduction','conclusion','dialogue','lettre'],
        estimatedMinutes: 120,
      },
      {
        id: 'fr-dictee',
        title: 'Dictée & Orthographe',
        description: 'Accord sujet-verbe. Accord du participe passé. Homophones grammaticaux (a/à, et/est, son/sont). Ponctuation. Majuscules.',
        bloomLevel: 2,
        keywords: ['dictée','accord','participe passé','homophones','ponctuation','orthographe'],
        estimatedMinutes: 30,
      },
    ],
  },

  {
    slug: 'histoire_geo',
    label: 'Histoire-Géographie',
    emoji: '🌍',
    color: '#F59E0B',
    colorDark: '#B45309',
    coef: 1.5,
    pointsMax: 75,
    description: 'Histoire contemporaine et géographie de la France et du monde.',
    chapters: [
      {
        id: 'hg-ww1',
        title: 'La Première Guerre mondiale (1914-1918)',
        description: 'Causes, déclenchement, batailles majeures (Verdun, Somme), vie des soldats (poilus), bilan humain, traité de Versailles.',
        bloomLevel: 4,
        keywords: ['1914','1918','tranchées','Verdun','Somme','poilus','armistice','Versailles','génocide arménien'],
        estimatedMinutes: 60,
      },
      {
        id: 'hg-regimes-totalitaires',
        title: 'Les régimes totalitaires (années 1930)',
        description: 'Stalinisme (URSS), fascisme (Italie), nazisme (Allemagne). Propagande, terreur, contrôle des masses.',
        bloomLevel: 4,
        keywords: ['totalitarisme','Staline','Hitler','Mussolini','propagande','NSDAP','Goulag','SS','purges'],
        estimatedMinutes: 60,
      },
      {
        id: 'hg-ww2',
        title: 'La Seconde Guerre mondiale (1939-1945)',
        description: 'Blitzkrieg, occupation de la France, collaboration, Résistance, Débarquement, Shoah, bilan de la guerre.',
        bloomLevel: 4,
        keywords: ['1939','1945','Shoah','Résistance','De Gaulle','appel du 18 juin','Débarquement','collaboration','libération'],
        estimatedMinutes: 75,
      },
      {
        id: 'hg-decolonisation',
        title: 'Décolonisation & Indépendances',
        description: 'Processus de décolonisation en Asie et Afrique. Guerre d\'Algérie. Relations Nord-Sud.',
        bloomLevel: 4,
        keywords: ['décolonisation','indépendance','Algérie','Indochine','Gandhi','non-alignement'],
        estimatedMinutes: 45,
      },
      {
        id: 'hg-guerre-froide',
        title: 'La Guerre froide (1947-1991)',
        description: 'Blocs Est-Ouest, OTAN vs Pacte de Varsovie, crise de Cuba, mur de Berlin, course aux armements, fin de la guerre froide.',
        bloomLevel: 4,
        keywords: ['URSS','USA','OTAN','Berlin','Cuba','missile','détente','glasnost','perestroïka','chute du mur'],
        estimatedMinutes: 60,
      },
      {
        id: 'hg-france-5eme-republique',
        title: 'La France sous la Ve République',
        description: 'Fondation de la Ve République (1958). De Gaulle. Mai 68. Alternances politiques. Construction européenne.',
        bloomLevel: 3,
        keywords: ['Ve République','De Gaulle','Constitution','Mai 68','Mitterrand','Chirac','cohabitation'],
        estimatedMinutes: 45,
      },
      {
        id: 'hg-geo-france',
        title: 'La France : territoire et aménagement',
        description: 'Aire urbaine de Paris. Métropolisation. Territoires ultramarins (DROM-COM). Aménagement du territoire. Inégalités spatiales.',
        bloomLevel: 3,
        keywords: ['aire urbaine','métropole','DROM','DOM','COM','aménagement','inégalités','banlieue','rural'],
        estimatedMinutes: 60,
      },
      {
        id: 'hg-geo-mondialisation',
        title: 'La mondialisation',
        description: 'Échanges mondiaux, FMN, ports et routes maritimes, pays émergents, inégalités mondiales (Centre/Périphérie).',
        bloomLevel: 4,
        keywords: ['mondialisation','FMN','échanges','BRICS','inégalités','Nord','Sud','flux','route maritime'],
        estimatedMinutes: 60,
      },
      {
        id: 'hg-geo-ue',
        title: 'La France dans l\'Union Européenne',
        description: 'Construction européenne. Institutions de l\'UE (Parlement, Commission, Conseil). Schengen. Euro.',
        bloomLevel: 3,
        keywords: ['Union Européenne','Parlement','Commission','Conseil','Schengen','euro','traité','élargissement'],
        estimatedMinutes: 45,
      },
    ],
  },

  {
    slug: 'emc',
    label: 'Enseignement Moral et Civique',
    emoji: '⚖️',
    color: '#8B5CF6',
    colorDark: '#6D28D9',
    coef: 0.5,
    pointsMax: 25,
    description: 'Valeurs républicaines, institutions et citoyenneté.',
    chapters: [
      {
        id: 'emc-republique',
        title: 'La République française',
        description: 'Valeurs de la République : liberté, égalité, fraternité. Principes : laïcité, démocratie. Symboles (drapeau, Marseillaise, devise). DDHC 1789.',
        bloomLevel: 3,
        keywords: ['liberté','égalité','fraternité','laïcité','démocratie','Marianne','DDHC','République'],
        estimatedMinutes: 45,
      },
      {
        id: 'emc-institutions',
        title: 'Les institutions françaises',
        description: 'Président de la République. Gouvernement. Parlement (Assemblée nationale, Sénat). Conseil constitutionnel. Élections.',
        bloomLevel: 3,
        keywords: ['Président','Premier ministre','Assemblée nationale','Sénat','Parlement','suffrage universel','élection','loi'],
        estimatedMinutes: 60,
      },
      {
        id: 'emc-citoyennete',
        title: 'Citoyenneté française et européenne',
        description: 'Nationalité et citoyenneté. Droits et devoirs du citoyen. Vote, service national, jury d\'assises. Citoyenneté européenne.',
        bloomLevel: 3,
        keywords: ['citoyenneté','nationalité','droit de vote','devoir','jury','service civique','passeport européen'],
        estimatedMinutes: 45,
      },
      {
        id: 'emc-defense',
        title: 'Défense nationale & Sécurité',
        description: 'L\'armée française (Terre, Mer, Air, Gendarmerie). OTAN. JDC (Journée Défense et Citoyenneté). Menaces contemporaines.',
        bloomLevel: 2,
        keywords: ['armée','OTAN','JDC','défense','terrorisme','cybersécurité','gendarmerie','police'],
        estimatedMinutes: 30,
      },
      {
        id: 'emc-droits-homme',
        title: 'Droits de l\'Homme & Solidarité',
        description: 'Déclaration Universelle des Droits de l\'Homme (1948). ONU. Organisations humanitaires. Égalité hommes-femmes.',
        bloomLevel: 3,
        keywords: ['DUDH','ONU','droits de l\'Homme','égalité','discrimination','solidarité','humanitaire'],
        estimatedMinutes: 45,
      },
    ],
  },

  {
    slug: 'sciences',
    label: 'Sciences',
    emoji: '🔬',
    color: '#10B981',
    colorDark: '#065F46',
    coef: 2,
    pointsMax: 50,
    description: 'Physique-Chimie, SVT et Technologie.',
    chapters: [
      {
        id: 'sci-chimie-matiere',
        title: 'Constitution de la matière',
        description: 'Atomes, molécules, ions. Modèle de Bohr simplifié. Tableau périodique (bases). Formules chimiques (eau, dioxyde de carbone, méthane). États de la matière.',
        bloomLevel: 2,
        keywords: ['atome','molécule','ion','proton','électron','neutron','formule chimique','H2O','CO2'],
        estimatedMinutes: 45,
      },
      {
        id: 'sci-chimie-reactions',
        title: 'Réactions chimiques',
        description: 'Équation-bilan. Conservation des masses (Lavoisier). Réactions acido-basiques. pH. Oxydation-réduction (bases). Mélanges et solutions.',
        bloomLevel: 3,
        keywords: ['réaction','équation-bilan','conservation','Lavoisier','pH','acide','base','oxydation','solution'],
        estimatedMinutes: 60,
      },
      {
        id: 'sci-electricite',
        title: 'Électricité & Circuits',
        description: 'Générateur, récepteur, circuit série et dérivation. Tension (U, en volts), intensité (I, en ampères). Loi d\'Ohm. Puissance électrique.',
        bloomLevel: 3,
        keywords: ['circuit','tension','intensité','résistance','loi d\'Ohm','série','dérivation','volt','ampère','watt'],
        estimatedMinutes: 60,
      },
      {
        id: 'sci-mecanique',
        title: 'Mécanique & Mouvements',
        description: 'Forces (poids, réaction, poussée d\'Archimède, frottements). Principe d\'inertie. Poids vs masse. Système solaire, gravitation universelle.',
        bloomLevel: 3,
        keywords: ['force','poids','masse','Newton','gravitation','inertie','Archimède','vitesse','accélération'],
        estimatedMinutes: 60,
      },
      {
        id: 'sci-energies',
        title: 'Énergies & Conversions',
        description: 'Sources d\'énergie (fossiles, renouvelables, nucléaire). Énergie cinétique, potentielle, mécanique. Transferts thermiques. Transition énergétique.',
        bloomLevel: 4,
        keywords: ['énergie','fossile','renouvelable','nucléaire','cinétique','thermique','transition','joule','watt'],
        estimatedMinutes: 45,
      },
      {
        id: 'sci-svt-cellule',
        title: 'La cellule & l\'unité du vivant',
        description: 'Cellule animale et végétale. Noyau, membrane, cytoplasme, chloroplaste. Mitose. Unicellulaire vs pluricellulaire.',
        bloomLevel: 2,
        keywords: ['cellule','noyau','membrane','cytoplasme','mitose','ADN','chloroplaste','unicellulaire'],
        estimatedMinutes: 45,
      },
      {
        id: 'sci-svt-genetique',
        title: 'Génétique & Hérédité',
        description: 'Chromosomes, ADN, gènes, allèles. Méiose et reproduction sexuée. Mutations. Transmission des caractères héréditaires. Évolution des espèces.',
        bloomLevel: 4,
        keywords: ['chromosome','ADN','gène','allèle','méiose','mutation','hérédité','évolution','sélection naturelle'],
        estimatedMinutes: 60,
      },
      {
        id: 'sci-svt-corps-humain',
        title: 'Corps humain & Santé',
        description: 'Système immunitaire : défenses non spécifiques et spécifiques, vaccination. Système reproducteur. Nutrition et digestion. Risques : tabac, alcool, drogues.',
        bloomLevel: 3,
        keywords: ['immunité','vaccin','anticorps','reproduction','digestion','tabac','alcool','nutrition','microbe'],
        estimatedMinutes: 60,
      },
      {
        id: 'sci-svt-ecosystemes',
        title: 'Écosystèmes & Environnement',
        description: 'Chaînes et réseaux alimentaires. Perturbations de l\'écosystème. Changement climatique. Biodiversité. Développement durable.',
        bloomLevel: 4,
        keywords: ['écosystème','chaîne alimentaire','biodiversité','changement climatique','CO2','développement durable'],
        estimatedMinutes: 45,
      },
      {
        id: 'sci-techno-objets',
        title: 'Objets techniques & Conception',
        description: 'Analyse fonctionnelle. Cahier des charges. Matériaux et propriétés. Cycle de vie d\'un produit. Impact environnemental.',
        bloomLevel: 3,
        keywords: ['analyse fonctionnelle','cahier des charges','matériau','cycle de vie','prototype','conception'],
        estimatedMinutes: 45,
      },
      {
        id: 'sci-techno-info',
        title: 'Informatique & Réseaux',
        description: 'Internet : protocoles, adresse IP, navigateur, serveur. Sécurité numérique. Données et vie privée. Programmation basique (Python/Scratch).',
        bloomLevel: 3,
        keywords: ['Internet','IP','protocole','serveur','navigateur','sécurité','données','vie privée','Python'],
        estimatedMinutes: 45,
      },
    ],
  },

  {
    slug: 'lv1',
    label: 'Langue Vivante 1 (Anglais)',
    emoji: '🇬🇧',
    color: '#F97316',
    colorDark: '#C2410C',
    coef: 2,
    pointsMax: 0,
    description: 'Compréhension orale et écrite, expression écrite et orale en anglais.',
    chapters: [
      {
        id: 'lv1-comprehension-ecrite',
        title: 'Compréhension de l\'écrit',
        description: 'Lire et comprendre un texte authentique (article, lettre, email, extrait littéraire). Identifier thème, idées principales, implicite.',
        bloomLevel: 3,
        keywords: ['reading','comprehension','main idea','inference','vocabulary','text type'],
        estimatedMinutes: 45,
      },
      {
        id: 'lv1-expression-ecrite',
        title: 'Expression écrite',
        description: 'Rédiger un texte en anglais : email, article, dialogue, description, récit. Connecteurs logiques. Grammaire de base.',
        bloomLevel: 5,
        keywords: ['writing','email','article','grammar','tenses','connectors','vocabulary'],
        estimatedMinutes: 60,
      },
      {
        id: 'lv1-grammaire',
        title: 'Grammaire anglaise',
        description: 'Present simple/continuous, past simple/continuous, present perfect, future (will/going to), modaux, passif, conditionnel.',
        bloomLevel: 3,
        keywords: ['present','past','perfect','future','modal','passive','conditional','tense'],
        estimatedMinutes: 60,
      },
    ],
  },

  {
    slug: 'technologie',
    label: 'Technologie',
    emoji: '⚙️',
    color: '#6366F1',
    colorDark: '#4338CA',
    coef: 1,
    pointsMax: 0,
    description: 'Conception, programmation et usage responsable du numérique.',
    chapters: [
      {
        id: 'techno-conception',
        title: 'Conception et modélisation',
        description: 'Modélisation 2D/3D. Dessin technique. Prototypage. Contraintes de conception.',
        bloomLevel: 4,
        keywords: ['modélisation','3D','dessin technique','prototype','contrainte','conception'],
        estimatedMinutes: 45,
      },
      {
        id: 'techno-programmation',
        title: 'Programmation & Robotique',
        description: 'Scratch, Python, Arduino (bases). Algorithmes : séquences, boucles, conditions. Déboguer un programme.',
        bloomLevel: 3,
        keywords: ['Scratch','Python','Arduino','algorithme','boucle','condition','débogage','robot'],
        estimatedMinutes: 60,
      },
    ],
  },
];

/**
 * Retrieve a subject by its slug identifier.
 */
export const getSubjectBySlug = (slug: SubjectSlug): Subject | undefined =>
  SUBJECTS.find(s => s.slug === slug);

/**
 * Retrieve a chapter by its unique ID across all subjects.
 */
export const getChapterById = (chapterId: string): Chapter | undefined => {
  for (const subject of SUBJECTS) {
    const chapter = subject.chapters.find(c => c.id === chapterId);
    if (chapter) return chapter;
  }
  return undefined;
};
