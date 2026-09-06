/* ==========================================================================
   KM UX DESIGNER — DATA STORE POUR LA PAGE PROJETS (AVEC IMAGE FOODLES KARINE)
   ========================================================================== */

const CASE_STUDIES_PRESENTATION = [
  {
    id: "foodles",
    number: "01",
    tags: ["RECHERCHE UX", "TESTS UTILISATEURS", "PROTOTYPE"],
    title: "Foodles – Le frigo connecté au bureau",
    subtitle: "Comprendre les véritables usages d'un frigo connecté en entreprise pour concevoir une expérience utile et adoptée au quotidien.",
    problem: "Peu d'adoption après le lancement : l'application ne s'intègre ni dans les usages ni dans les routines.",
    demarche: "Recherche utilisateurs, tests en situation réelle, analyse des freins et opportunités.",
    livrables: "Recommandations UX, parcours clés, prototype interactif.",
    steps: [
      { name: "Recherche terrain", icon: "users" },
      { name: "Entretiens utilisateurs", icon: "user-check" },
      { name: "Tests utilisateurs", icon: "file-text" },
      { name: "Analyse & synthèse", icon: "bar-chart-2" },
      { name: "Prototypage hi-fi", icon: "layout" }
    ],
    canvaUrl: "https://www.canva.com", // Lien vers la présentation Canva en accès libre
    image: "assets/PROJTS/FOODLES/presentation%20foodles.png"
  },
  {
    id: "bambinets",
    number: "02",
    tags: ["UX RESEARCH", "PARCOURS", "PROTOTYPE"],
    title: "Bambinets – L’apprentissage des parents",
    subtitle: "Concevoir une application mobile de micro-learning pour accompagner les parents dans leur quotidien.",
    problem: "Les contenus existent, mais les parents manquent de temps et de repères.",
    demarche: "Parcours utilisateurs, tri de cartes, idéation, tests utilisateurs, itérations.",
    livrables: "Arborescences, parcours prioritaires, prototype hi-fi, recommandations stratégiques.",
    steps: [
      { name: "Recherche utilisateur", icon: "users" },
      { name: "Tri de cartes", icon: "layers" },
      { name: "Parcours utilisateur", icon: "map-pin" },
      { name: "Tests d'utilisabilité", icon: "smile" },
      { name: "Prototypage hi-fi", icon: "smartphone" }
    ],
    canvaUrl: "https://www.canva.com",
    image: "assets/PROJTS/BAMBINETS/project-bambinets.png.png"
  },
  {
    id: "cordons-bleus",
    number: "03",
    tags: ["E-LEARNING", "CONCEPTION PÉDAGOGIQUE", "UX"],
    title: "Cordons bleus – Formation en ligne",
    subtitle: "Refonte d’un parcours e-learning pour rendre l’apprentissage des techniques culinaires plus engageant et efficace.",
    problem: "Un parcours peu engageant et des abandons élevés aux fins des modules.",
    demarche: "Audit pédagogique & UX, analyse des données, ateliers d'idéation, de déploiement.",
    livrables: "Scénario pédagogique, storyboard, maquettes & prototype, roadmap de déploiement.",
    steps: [
      { name: "Audit UX & pédagogique", icon: "search" },
      { name: "Ateliers d'idéation", icon: "lightbulb" },
      { name: "Scénario pédagogique", icon: "book-open" },
      { name: "Maquettes & Prototypes", icon: "tablet" },
      { name: "Roadmap & Priorisation", icon: "target" }
    ],
    canvaUrl: "https://www.canva.com",
    image: "assets/PROJTS/CORDONS%20BLEUS/0095ccd6-8d9e-479e-b1ac-9738bf60631f.png"
  },
  {
    id: "florence-kooijman",
    number: "04",
    tags: ["AUDIT UX", "ACCESSIBILITÉ", "PARCOURS CLIENT"],
    title: "Florence Kooijman – Audit UX complet",
    subtitle: "Audit du parcours d’achat d’un site e-commerce de chaussures sur-mesure pour identifier les freins et améliorer la conversion.",
    problem: "Un parcours complexe qui entraîne de la confusion et des abandons.",
    demarche: "Audit heuristique, tests utilisateurs, analyse quantitative, benchmark concurrentiel.",
    livrables: "Rapport d'audit, recommandations priorisées, quick wins, plan d'action.",
    steps: [
      { name: "Audit heuristique", icon: "check-square" },
      { name: "Tests utilisateurs", icon: "users" },
      { name: "Analyse quantitative", icon: "trending-up" },
      { name: "Recommandations priorisées", icon: "list-checks" },
      { name: "Plan d'action", icon: "flag" }
    ],
    canvaUrl: "https://www.canva.com",
    image: "assets/PROJTS/KOOIJMAN/project-kooijman-generale.png.png"
  }
];

const ARTICLES_DATA = [
  {
    title: "Pourquoi l'âge est un super-pouvoir d'écoute en UX",
    category: "Réflexion & Carrière",
    date: "14 Juillet 2026",
    summary: "À 55 ans, on sait déjà écouter sans juger et simplifier ce qui est complexe."
  },
  {
    title: "La charge cognitive en E-Learning : Éliminer le bruit inutile",
    category: "Ingénierie Pédagogique",
    date: "02 Juin 2026",
    summary: "Concevoir des parcours fluides où l'apprenant se concentre sur l'apprentissage."
  }
];

const PRICING_PACKS = [
  {
    title: "Audit UX & Diagnostic Ergonomique",
    price: "2 400 €",
    delay: "1 à 2 Semaines",
    desc: "Évaluation complète de votre produit existant avec rapport d'audit heuristique et préconisations de refonte."
  },
  {
    title: "Design System & Tokens Figma",
    price: "4 800 €",
    delay: "3 à 4 Semaines",
    desc: "Bibliothèque UI propre, accessible WCAG AAA et documentée pour accélérer vos équipes dev."
  },
  {
    title: "Conception E-Learning Sur-Mesure",
    price: "7 500 €",
    delay: "4 à 6 Semaines",
    desc: "De la recherche utilisateur jusqu'au prototype haute-fidélité prêt pour la recette dev."
  }
];
