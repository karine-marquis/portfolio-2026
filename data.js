/* ==========================================================================
   KM UX DESIGNER — DATA STORE POUR LA PAGE PROJETS (AVEC IMAGE FOODLES KARINE)
   ========================================================================== */

const CASE_STUDIES_PRESENTATION = [
  {
    id: "cordons-bleus",
    number: "01",
    title: "LES CORDONS BLEUS",
    category: "Conception UX & digital learning",
    headline: "Le vrai défi commence quand le cours s’arrête.",
    subheadline: "« Comment aider les apprenants à continuer seuls, sans perdre l’élan ? »",
    description: "",
    image: "assets/PROJTS/CORDONS_BLEUS/illustration_coup_d_oeil.png",
    glanceSteps: [
      { num: "01", name: "Rupture d'apprentissage", icon: "link-2-off" },
      { num: "02", name: "Analyse des besoins", icon: "search" },
      { num: "03", name: "Continuité présentiel/digital", icon: "user" },
      { num: "04", name: "Solutions prioritaires", icon: "chef-hat" }
    ],
    methodologyLabel: "Approche & outils :",
    methodology: [
      { name: "recherche UX", icon: "search" },
      { name: "personas", icon: "user" },
      { name: "journey map", icon: "map" },
      { name: "architecture de l’information", icon: "layout" },
      { name: "service blueprint", icon: "git-branch" },
      { name: "digital learning", icon: "graduation-cap" }
    ]
  },
  {
    id: "bambinets",
    number: "02",
    title: "BAMBINETS",
    category: "UX Design & Micro-learning",
    headline: "Apprendre quelques signes pour mieux se comprendre avant les premiers mots.",
    subheadline: "« Comment faciliter la communication quotidienne entre pro et tout-petits ? »",
    description: "",
    image: "assets/PROJTS/BAMBINETS/vignette_bambinets.png",
    glanceSteps: [
      { num: "01", name: "Surcharge mentale", icon: "brain" },
      { num: "02", name: "Tri de cartes", icon: "layers" },
      { num: "03", name: "Micro-parcours", icon: "map-pin" },
      { num: "04", name: "Maquettes hi-fi", icon: "smartphone" }
    ],
    methodologyLabel: "Approche & outils :",
    methodology: [
      { name: "recherche utilisateur", icon: "users" },
      { name: "tri de cartes", icon: "layers" },
      { name: "parcours client", icon: "map-pin" },
      { name: "prototype mobile", icon: "smartphone" },
      { name: "tests hi-fi", icon: "smile" }
    ]
  },
  {
    id: "foodles",
    number: "03",
    title: "FOODLES",
    category: "UX Research & optimisation mobile",
    headline: "Adopter une nouvelle habitude au bureau demande de la simplicité à chaque clic.",
    subheadline: "« Comment lever les frictions d'usage sur un frigo connecté en entreprise ? »",
    description: "",
    image: "assets/PROJTS/FOODLES/frigo_foodles.png",
    glanceSteps: [
      { num: "01", name: "Remontées internes", icon: "message-square" },
      { num: "02", name: "Hypothèses UX", icon: "help-circle" },
      { num: "03", name: "Tests utilisateurs", icon: "users" },
      { num: "04", name: "Insights & recommandations", icon: "sparkles" }
    ],
    methodologyLabel: "Approche & outils :",
    methodology: [
      { name: "hypothèses UX", icon: "help-circle" },
      { name: "observation des usages", icon: "search" },
      { name: "atomic UX research", icon: "sparkles" },
      { name: "préconisations", icon: "check-circle-2" }
    ]
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
