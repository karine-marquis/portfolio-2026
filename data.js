/* ==========================================================================
   KM UX DESIGNER — DATA STORE POUR LA PAGE PROJETS (AVEC IMAGE FOODLES KARINE)
   ========================================================================== */

const CASE_STUDIES_PRESENTATION = [
  {
    id: "cordons-bleus",
    number: "01",
    title: "LES CORDONS BLEUS",
    category: "Conception UX & digital learning",
    headline: "Quand le cours se termine, l’apprentissage ne devrait pas s’arrêter avec lui.",
    description: "L’école proposait une expérience riche en présentiel, mais une fois l’atelier terminé, les élèves se retrouvaient seuls : peu de ressources pour revoir, pratiquer ou prolonger ce qu’ils venaient d’apprendre.<br><br>J’ai travaillé sur une refonte du site pour créer une continuité entre l’expérience en cuisine et l’expérience numérique, tout en améliorant la personnalisation et les repères avant réservation.",
    image: "assets/PROJTS/CORDONS%20BLEUS/illustration_coup_d_oeil.png",
    glanceSteps: [
      { num: "01", name: "Rupture d'apprentissage", icon: "link-2-off" },
      { num: "02", name: "Analyse des besoins", icon: "search" },
      { num: "03", name: "Continuité présentiel/digital", icon: "user" },
      { num: "04", name: "Solutions prioritaires", icon: "chef-hat" }
    ],
    methodology: [
      { name: "analyse documentaire", icon: "search" },
      { name: "personas", icon: "user" },
      { name: "benchmark", icon: "bar-chart-2" },
      { name: "service blueprint", icon: "git-branch" },
      { name: "architecture", icon: "layout" },
      { name: "accessibilité", icon: "accessibility" },
      { name: "roadmap", icon: "calendar" }
    ]
  },
  {
    id: "bambinets",
    number: "02",
    title: "BAMBINETS",
    category: "UX Design & Micro-learning",
    headline: "Apprendre quelques signes pour mieux se comprendre avant les premiers mots.",
    description: "Avant de savoir parler, un enfant sait déjà exprimer beaucoup de choses. Encore faut-il pouvoir se comprendre.<br><br>La crèche Les Bambinets voulait un outil simple pour aider les professionnels de la petite enfance — et les parents — à apprendre quelques signes utiles au quotidien, sans transformer ça en formation lourde.<br><br>L’idée était donc de concevoir une application mobile pensée pour des usages très concrets : peu de temps, une attention souvent partagée, et le besoin de retrouver ou mémoriser un signe rapidement.",
    image: "assets/PROJTS/BAMBINETS/vignette_bambinets.png",
    glanceSteps: [
      { num: "01", name: "Surcharge mentale", icon: "brain" },
      { num: "02", name: "Tri de cartes", icon: "layers" },
      { num: "03", name: "Micro-parcours", icon: "map-pin" },
      { num: "04", name: "Maquettes hi-fi", icon: "smartphone" }
    ],
    methodology: [
      { name: "recherche utilisateur", icon: "users" },
      { name: "tri de cartes", icon: "layers" },
      { name: "parcours client", icon: "map-pin" },
      { name: "tests hi-fi", icon: "smile" }
    ]
  },
  {
    id: "foodles",
    number: "03",
    title: "FOODLES",
    category: "UX Research & optimisation mobile",
    headline: "Adopter une nouvelle habitude au bureau demande de la simplicité à chaque clic.",
    description: "Comprendre les véritables usages d'un frigo connecté en entreprise pour concevoir une expérience utile et adoptée au quotidien.",
    image: "assets/PROJTS/FOODLES/presentation%20foodles.png",
    glanceSteps: [
      { num: "01", name: "Freins d'usage", icon: "alert-circle" },
      { num: "02", name: "Entretiens terrain", icon: "users" },
      { num: "03", name: "Simplification parcours", icon: "sparkles" },
      { num: "04", name: "Prototype hi-fi", icon: "smartphone" }
    ],
    methodologyLabel: "Ma démarche :",
    methodology: [
      { name: "partir des hypothèses" },
      { name: "observer les usages" },
      { name: "faire émerger les faits" },
      { name: "transformer les insights en décisions" }
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
