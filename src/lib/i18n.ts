export const translations = {
  en: {
    nav: {
      features: "Features",
      gallery: "Gallery",
      dashboard: "Dashboard",
      storytelling: "Storytelling",
      aiChat: "AI Chat",
      settings: "Settings",
      signIn: "Sign In",
      getStarted: "Get Started",
      signOut: "Sign Out"
    },
    hero: {
      title: "Build Your Universe of",
      subtitle: "AI-Powered Portfolios",
      description: "Create stunning, intelligent portfolios that showcase your work with the power of AI. Generate content, sync GitHub projects, and share your story with the world.",
      cta: "Start Creating"
    },
    dashboard: {
      title: "My Projects",
      newProject: "New Project",
      noProjects: "No projects yet",
      startCreating: "Start by creating your first project or sync from GitHub",
      syncGitHub: "Sync from GitHub"
    },
    storytelling: {
      title: "AI Storytelling",
      description: "Create compelling narratives for your projects",
      generate: "Generate",
      save: "Save Story"
    },
    settings: {
      title: "Settings",
      profile: "Profile",
      theme: "Visual Theme",
      language: "Language"
    },
    share: {
      linkedin: "Share on LinkedIn",
      copy: "Copy Link"
    }
  },
  es: {
    nav: {
      features: "Características",
      gallery: "Galería",
      dashboard: "Panel",
      storytelling: "Narrativa",
      aiChat: "Chat IA",
      settings: "Ajustes",
      signIn: "Iniciar Sesión",
      getStarted: "Comenzar",
      signOut: "Cerrar Sesión"
    },
    hero: {
      title: "Construye Tu Universo de",
      subtitle: "Portafolios Potenciados por IA",
      description: "Crea portafolios impresionantes e inteligentes que muestren tu trabajo con el poder de la IA. Genera contenido, sincroniza proyectos de GitHub y comparte tu historia con el mundo.",
      cta: "Comenzar a Crear"
    },
    dashboard: {
      title: "Mis Proyectos",
      newProject: "Nuevo Proyecto",
      noProjects: "Aún no hay proyectos",
      startCreating: "Comienza creando tu primer proyecto o sincroniza desde GitHub",
      syncGitHub: "Sincronizar desde GitHub"
    },
    storytelling: {
      title: "Narrativa con IA",
      description: "Crea narrativas convincentes para tus proyectos",
      generate: "Generar",
      save: "Guardar Historia"
    },
    settings: {
      title: "Ajustes",
      profile: "Perfil",
      theme: "Tema Visual",
      language: "Idioma"
    },
    share: {
      linkedin: "Compartir en LinkedIn",
      copy: "Copiar Enlace"
    }
  },
  fr: {
    nav: {
      features: "Fonctionnalités",
      gallery: "Galerie",
      dashboard: "Tableau de bord",
      storytelling: "Narration",
      aiChat: "Chat IA",
      settings: "Paramètres",
      signIn: "Se connecter",
      getStarted: "Commencer",
      signOut: "Se déconnecter"
    },
    hero: {
      title: "Construisez Votre Univers de",
      subtitle: "Portfolios Alimentés par l'IA",
      description: "Créez des portfolios époustouflants et intelligents qui mettent en valeur votre travail avec la puissance de l'IA. Générez du contenu, synchronisez les projets GitHub et partagez votre histoire avec le monde.",
      cta: "Commencer à Créer"
    },
    dashboard: {
      title: "Mes Projets",
      newProject: "Nouveau Projet",
      noProjects: "Pas encore de projets",
      startCreating: "Commencez par créer votre premier projet ou synchronisez depuis GitHub",
      syncGitHub: "Synchroniser depuis GitHub"
    },
    storytelling: {
      title: "Narration IA",
      description: "Créez des récits convaincants pour vos projets",
      generate: "Générer",
      save: "Enregistrer l'histoire"
    },
    settings: {
      title: "Paramètres",
      profile: "Profil",
      theme: "Thème Visuel",
      language: "Langue"
    },
    share: {
      linkedin: "Partager sur LinkedIn",
      copy: "Copier le lien"
    }
  }
};

export type Language = keyof typeof translations;
export type TranslationKey = typeof translations.en;