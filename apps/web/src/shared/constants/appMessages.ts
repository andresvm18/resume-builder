export const APP_MESSAGES = {
  GENERIC_ERROR: "Ocurrió un error inesperado. Intenta nuevamente.",

  NETWORK_ERROR: "No se pudo conectar con el servidor.",

  UNAUTHORIZED: "Tu sesión expiró. Inicia sesión nuevamente.",

  ATS: {
    SCORE_BADGE: "Puntuación ATS",
    KEYWORD_MATCH_LABEL: "Coincidencia de palabras clave",
    SECTION_COMPLETENESS_LABEL: "Integridad de secciones",
    FORMAT_QUALITY_LABEL: "Calidad del formato",
    ROLE_ALIGNMENT_LABEL: "Alineación con el rol",

    ANALYSIS_TITLE: "Análisis ATS",
    ANALYSIS_DESCRIPTION: "Evaluación estimada de compatibilidad entre tu currículum y la oferta laboral.",
    SCORE_LABEL: "Score ATS",

    KEYWORDS_SECTION_TITLE: "Palabras clave analizadas por categoría",
    KEYWORDS_TECHNICAL: "Técnicas / herramientas",
    KEYWORDS_SOFT_SKILLS: "Habilidades blandas",
    KEYWORDS_CERTIFICATIONS: "Certificaciones",
    KEYWORDS_RESPONSIBILITIES: "Responsabilidades",
    RECOMMENDATIONS_TITLE: "Recomendaciones",
    LOADING_RECOMMENDATIONS: "Generando recomendaciones con IA...",
    RECOMMENDATIONS_FAILED: "No se pudo generar la recomendación con IA. Mostrando recomendaciones básicas.",
    NO_RECOMMENDATIONS: "Aún no hay recomendaciones generadas.",

    COMPLETENESS_LABEL: "Completitud",
    COMPLETENESS_DESCRIPTION: "Secciones importantes del CV",
    FORMAT_LABEL: "Formato",
    FORMAT_DESCRIPTION: "Claridad y estructura del CV",
    ALIGNMENT_LABEL: "Alineación",
    ALIGNMENT_DESCRIPTION: "Relación con el puesto",
    KEYWORD_MATCH_DESCRIPTION: "Coincidencia estimada de palabras clave",

    DISCLAIMER: "Este score es una estimación heurística basada en coincidencia de palabras clave, estructura del currículum y alineación con la oferta. Las keywords y recomendaciones pueden ser generadas por IA cuando el servicio está disponible.",
  },

  LANDING: {
    HERO_BADGE: "Plataforma de Currículums Optimizados para ATS",
    HERO_TITLE: "Construye un currículum profesional en minutos.",
    HERO_DESCRIPTION: "Optimizado para ATS, exportable a PDF y diseñado para ayudarte a presentarte mejor.",
    HERO_BUTTON: "Crear tu Currículum",

    FEATURES_EYEBROW: "Por qué elegir ResumeBuilder",
    FEATURES_TITLE: "Herramientas para presentar tu experiencia con claridad.",
    FEATURE_ATS_TITLE: "Optimización ATS",
    FEATURE_ATS_DESCRIPTION: "Analiza la compatibilidad de tu currículum con sistemas de seguimiento de candidatos.",
    FEATURE_PDF_TITLE: "Exportar a PDF",
    FEATURE_PDF_DESCRIPTION: "Descarga currículums en formato profesional, listos para enviar con un solo clic.",

    CTA_TITLE: "Empieza a construir tu próximo currículum hoy.",
    CTA_DESCRIPTION: "Una herramienta simple para presentar tu perfil de forma clara y profesional.",
    CTA_BUTTON: "Comenzar",
  },


  AUTH: {
    LOGIN_TITLE: "Bienvenido de nuevo",
    LOGIN_SUBTITLE: "Inicia sesión para continuar construyendo tu currículum optimizado para ATS.",
    LOGIN_BUTTON: "Iniciar sesión",
    LOGIN_BUTTON_LOADING: "Iniciando sesión...",
    LOGIN_ERROR: "Correo o contraseña inválidos.",

    REGISTER_TITLE: "Crea tu cuenta",
    REGISTER_SUBTITLE: "Regístrate para comenzar a construir tu currículum optimizado para ATS.",
    REGISTER_BUTTON: "Crear cuenta",
    REGISTER_BUTTON_LOADING: "Creando cuenta...",
    REGISTER_ERROR: "No se pudo crear la cuenta. Intenta con otro correo.",

    EMAIL_LABEL: "Correo electrónico",
    EMAIL_PLACEHOLDER: "tu@ejemplo.com",
    PASSWORD_LABEL: "Contraseña",
    PASSWORD_PLACEHOLDER: "••••••••",
    CONFIRM_PASSWORD_LABEL: "Confirmar",
    CONFIRM_PASSWORD_PLACEHOLDER: "••••••••",
    PASSWORD_MISMATCH: "Las contraseñas no coinciden.",
    PASSWORD_TOO_SHORT: "La contraseña debe tener al menos 8 caracteres.",

    FIRST_NAME_LABEL: "Nombre",
    FIRST_NAME_PLACEHOLDER: "Juan",
    MIDDLE_NAME_LABEL: "Segundo nombre",
    MIDDLE_NAME_PLACEHOLDER: "Carlos",
    LAST_NAME_LABEL: "Apellido",
    LAST_NAME_PLACEHOLDER: "Pérez",

    SHOW_PASSWORD: "Mostrar contraseña",
    HIDE_PASSWORD: "Ocultar contraseña",
    SHOW_CONFIRM_PASSWORD: "Mostrar confirmación de contraseña",
    HIDE_CONFIRM_PASSWORD: "Ocultar confirmación de contraseña",

    NO_ACCOUNT: "¿No tienes una cuenta?",
    CREATE_ACCOUNT_LINK: "Crear una",
    HAVE_ACCOUNT: "¿Ya tienes una cuenta?",
    LOGIN_LINK: "Iniciar sesión",


    LOGIN_PAGE_EYEBROW: "Bienvenido de nuevo",
    LOGIN_PAGE_HEADLINE: "Continúa tu viaje",
    LOGIN_PAGE_BODY: "Inicia sesión para acceder a tus currículums, ver tus puntuaciones ATS y seguir construyendo documentos que definen tu carrera y llaman la atención.",
    LOGIN_BENEFIT_1: "Accede a todos tus currículums guardados",
    LOGIN_BENEFIT_2: "Monitorea tu progreso de optimización ATS",
    LOGIN_BENEFIT_3: "Continúa donde lo dejaste",

    REGISTER_PAGE_EYEBROW: "Únete a ResumeBuilder",
    REGISTER_PAGE_HEADLINE: "Tu próximo rol comienza con el currículum adecuado.",
    REGISTER_PAGE_BODY: "Crea un currículum optimizado para ATS que supere los filtros y llegue a las manos de los reclutadores.",
    REGISTER_PERK_1: "Puntuación ATS con desglose en vivo",
    REGISTER_PERK_2: "Exportación a PDF con un clic",
    REGISTER_PERK_3: "Coincidencia de palabras clave específicas del rol",

  },

  DASHBOARD: {
    DOWNLOAD_FAILED: "No se pudo descargar el CV.",
    DUPLICATE_SUCCESS: "CV duplicado correctamente.",
    DUPLICATE_FAILED: "No se pudo duplicar el CV.",
    DELETE_FAILED: "No se pudo eliminar el CV.",
    DELETE_CONFIRM: "¿Estás seguro de que querés eliminar este currículum?",
    DELETE_ACTION: "Eliminar CV",
    DELETING: "Eliminando...",
    EMPTY_RESULTS: "No encontramos resultados.",
    EMPTY_RESULTS_DESCRIPTION: "No hay currículums que coincidan con tu búsqueda actual.",
    DELETE_TITLE: "Eliminar currículum",
    DELETE_DESCRIPTION: "Esta acción no se puede deshacer.",

    GREETING: "Bienvenido de nuevo",
    SUBTEXT: "Gestiona tus currículums y crea nuevas oportunidades.",
    CREATE_BUTTON: "Crear Currículum",

    STATS_TOTAL_RESUMES: "Total de Currículums",
    STATS_TOTAL_VERSIONS: "Versiones Guardadas",
    STATS_LAST_UPDATED: "Última Actualización",
    STATS_DOCUMENTS_UNIT: "documentos",
    STATS_VERSIONS_UNIT: "versiones",
    STATS_NO_ACTIVITY: "Sin actividad",

    SECTION_TITLE: "Tus Currículums",
    SEARCH_PLACEHOLDER: "Buscar por título...",

    SORT_RECENT: "Más recientes",
    SORT_OLDEST: "Más antiguos",
    SORT_NAME: "Nombre A-Z",

    CARD_BADGE: "CV guardado",
    CARD_DESCRIPTION: "CV generado automáticamente",
    CARD_EDIT_BUTTON: "Editar",
    CARD_DUPLICATE_BUTTON: "Duplicar",
    CARD_DELETE_BUTTON: "Eliminar",
    CARD_DOWNLOAD_BUTTON: "Descargar",

    EMPTY_TITLE: "Aún no tienes currículums",
    EMPTY_DESCRIPTION: "Comienza creando tu primer CV profesional en minutos. Podrás editarlo, descargarlo y administrar todas sus versiones.",
    EMPTY_BUTTON: "Nuevo Currículum",

    CLEAR_FILTERS_BUTTON: "Limpiar filtros",
  },

  PDF: {
    PREPARING:
      "Preparando generación del PDF...",

    OPTIMIZATION_ERROR:
      "No se pudo completar el análisis ATS final.",

    GENERATING:
      "Generando tu currículum en PDF...",

    FAILED:
      "No se pudo generar el PDF.",
  },

  AI: {
    OPTIMIZING: "Optimizando tu CV con IA...",
    ANALYZING: "Analizando compatibilidad ATS...",
    FAILED: "No se pudo completar la optimización con IA.",
    GENERATION_ERROR: "No se pudo generar el CV. Intenta nuevamente.",
  },

  PROFILE: {
    SAVED: "Perfil actualizado correctamente.",
    FAILED: "No se pudo actualizar el perfil.",
    COMPLETENESS_EYEBROW: "Estado del perfil",
    COMPLETENESS_PERCENTAGE: "% completado",
    COMPLETENESS_READY: "Tu perfil ya tiene la información mínima para generar CVs con IA.",
    COMPLETENESS_NOT_READY: "Completa la información requerida para generar CVs con IA.",
    BADGE_READY: "Listo para IA",
    BADGE_INCOMPLETE: "Incompleto",
    SECTION_REQUIRED: "Requerido",
    SECTION_OPTIONAL: "Opcional",

    FIELD_PERSONAL_INFO: "Información personal",
    FIELD_EDUCATION: "Educación",
    FIELD_SKILLS: "Habilidades",
    FIELD_SUMMARY: "Resumen profesional",
    FIELD_EXPERIENCE: "Experiencia",
    FIELD_LANGUAGES: "Idiomas",
    FIELD_PROJECTS: "Proyectos",

    LOADING_PROFILE: "Cargando tu perfil profesional...",
    COMPLETE_PROFILE_TITLE: "Completa tu perfil primero",
    COMPLETE_PROFILE_DESCRIPTION: "Necesitas completar tu perfil profesional antes de generar currículums personalizados con IA.",
    GO_TO_PROFILE_BUTTON: "Ir a mi perfil",
    GENERATE_CV_TITLE: "Generar CV desde Perfil",
    GENERATE_CV_DESCRIPTION: "Pega una oferta laboral y la IA generará un CV optimizado usando tu perfil profesional.",
    TARGET_ROLE_PLACEHOLDER: "Puesto objetivo. Ej: Frontend Developer",
    TARGET_COMPANY_PLACEHOLDER: "Empresa objetivo. Ej: Roche",
    JOB_DESCRIPTION_PLACEHOLDER: "Pega aquí la oferta laboral...",
    GENERATE_BUTTON: "Generar CV",
    GENERATING_BUTTON: "Generando...",

    STEP_PERSONAL: "Personal",
    STEP_SUMMARY: "Resumen",
    STEP_SKILLS: "Habilidades",
    STEP_EXPERIENCE: "Experiencia",
    STEP_EDUCATION: "Educación",
    STEP_LANGUAGES: "Idiomas",
    STEP_PROJECTS: "Proyectos",

    SAVE_STATUS_SAVED_AT: "Cambios guardados a las ",
  },

  PROFILE_PAGE: {
    LOADING: "Cargando perfil...",
    TITLE: "Perfil profesional",
    DESCRIPTION: "Guarda toda tu información profesional para reutilizarla automáticamente en futuros currículums.",
    SAVING: "Guardando cambios...",
    LOADED: "Perfil cargado",
    SAVE_ERROR: "No se pudieron guardar los cambios",
    SAVE_BUTTON_LOADING: "Guardando...",
    SAVE_BUTTON_DIRTY: "Guardar cambios",
    SAVE_BUTTON_SAVED: "Guardado",
  },

  MODAL: {
    CANCEL: "Cancelar",
  },

  RESUME_CREATION: {
    EYEBROW: "Nuevo currículum",
    TITLE: "¿Cómo quieres crear tu CV?",
    DESCRIPTION: "Elige si quieres generar un currículum automáticamente desde tu perfil profesional o empezar manualmente desde cero.",

    GENERATE_FROM_PROFILE_TITLE: "Generar desde mi perfil",
    GENERATE_FROM_PROFILE_DESCRIPTION: "Usa tu perfil profesional y una oferta laboral para crear un CV optimizado automáticamente con IA.",

    CREATE_FROM_SCRATCH_TITLE: "Crear desde cero",
    CREATE_FROM_SCRATCH_DESCRIPTION: "Completa manualmente cada sección usando el asistente paso a paso del constructor de CVs.",

    RECOMMENDED_BADGE: "Recomendado",
  },

  MONTHS: {
    JANUARY: "Enero",
    FEBRUARY: "Febrero",
    MARCH: "Marzo",
    APRIL: "Abril",
    MAY: "Mayo",
    JUNE: "Junio",
    JULY: "Julio",
    AUGUST: "Agosto",
    SEPTEMBER: "Septiembre",
    OCTOBER: "Octubre",
    NOVEMBER: "Noviembre",
    DECEMBER: "Diciembre",
  },

  RESUME_BUILDER: {
    // Personal Step
    FULL_NAME_PLACEHOLDER: "Nombre Completo",
    EMAIL_PLACEHOLDER: "Correo Electrónico",
    PHONE_PLACEHOLDER: "Teléfono",
    LOCATION_PLACEHOLDER: "Ubicación",

    // Job Description
    TARGET_ROLE_PLACEHOLDER: "Puesto objetivo. Ej: Frontend Developer",
    TARGET_COMPANY_PLACEHOLDER: "Empresa objetivo. Ej: Empresa XYZ",
    JOB_DESCRIPTION_PLACEHOLDER: "Pega aquí la descripción de la oferta laboral para analizar palabras clave, requisitos y compatibilidad ATS...",

    // Summary Step
    SUMMARY_PLACEHOLDER: "Escribe un resumen profesional atractivo que destaque tu experiencia, habilidades y objetivos...",

    // Experience
    EXPERIENCE_TITLE: "Experiencia Laboral",
    REMOVE_EXPERIENCE_ARIA: "Eliminar experiencia",
    JOB_TITLE_PLACEHOLDER: "Puesto",
    COMPANY_PLACEHOLDER: "Empresa",
    START_MONTH_PLACEHOLDER: "Mes de inicio",
    START_YEAR_PLACEHOLDER: "Año de inicio",
    END_MONTH_PLACEHOLDER: "Mes de finalización",
    END_YEAR_PLACEHOLDER: "Año finalización",
    CURRENTLY_WORKING_LABEL: "Actualmente trabajo aquí",
    DESCRIPTION_PLACEHOLDER: "Descripción (cada punto en una nueva línea)",
    ADD_EXPERIENCE_BUTTON: "Agregar Experiencia",

    // Education
    EDUCATION_TITLE: "Educación",
    INSTITUTION_PLACEHOLDER: "Institución",
    DEGREE_PLACEHOLDER: "Título / Grado",
    GRADUATION_YEAR_PLACEHOLDER: "Año de finalización (o estimado)",
    ADD_EDUCATION_BUTTON: "Agregar Educación",
    REMOVE_EDUCATION_ARIA: "Eliminar educación",

    // Skills
    SKILLS_PLACEHOLDER: "Escribe tus habilidades Ej: 'React, TypeScript, Node.js'",
    ADD_SKILL_BUTTON: "Agregar",
    REMOVE_SKILL_ARIA: "Eliminar habilidad",

    // Languages
    LANGUAGE_TITLE: "Idioma",
    LANGUAGE_NAME_PLACEHOLDER: "Idioma",
    LANGUAGE_LEVEL_BASIC: "Básico",
    LANGUAGE_LEVEL_INTERMEDIATE: "Intermedio",
    LANGUAGE_LEVEL_ADVANCED: "Avanzado",
    LANGUAGE_LEVEL_NATIVE: "Nativo",
    ADD_LANGUAGE_BUTTON: "Agregar Idioma",
    REMOVE_LANGUAGE_ARIA: "Eliminar idioma",

    // Projects
    PROJECT_TITLE: "Proyecto",
    PROJECT_NAME_PLACEHOLDER: "Nombre del proyecto",
    PROJECT_TECHNOLOGIES_PLACEHOLDER: "Tecnologías",
    PROJECT_DESCRIPTION_PLACEHOLDER: "Descripción del proyecto",
    PROJECT_LINK_PLACEHOLDER: "Enlace (GitHub / Demo)",
    ADD_PROJECT_BUTTON: "Agregar Proyecto",
    REMOVE_PROJECT_ARIA: "Eliminar proyecto",

    // Common
    WITHOUT_TITLE: "sin título",

    // Step Navigation
    NAV_PREV_BUTTON: "Anterior",
    NAV_NEXT_BUTTON: "Siguiente",
    NAV_FINISH_BUTTON: "¡Listo! Generar CV",

    // Step Wizard (nuevos)
    WIZARD_STEP_ARIA: "Paso",

    // Template Selector
    TEMPLATE_TITLE: "Plantilla del CV",

    TEMPLATE_CLASSIC_LABEL: "Clásico",
    TEMPLATE_CLASSIC_DESCRIPTION: "Diseño compatible con ATS con divisores de sección tradicionales.",

    TEMPLATE_MODERN_LABEL: "Moderno",
    TEMPLATE_MODERN_DESCRIPTION: "Encabezado centrado con acentos dorados y espaciado refinado.",

    TEMPLATE_COMPACT_LABEL: "Compacto",
    TEMPLATE_COMPACT_DESCRIPTION: "Diseño reducido para currículums extensos y contenido denso.",

    // Errors y notificaciones
    RESUME_NOT_FOUND_ERROR: "No encontramos ese CV. Puede haber sido eliminado o no tienes acceso",
    OPTIMIZE_SUMMARY_ERROR: "No se pudo optimizar el resumen",
    GENERATE_RECOMMENDATIONS_ERROR: "No se pudieron generar recomendaciones con IA. Puedes continuar manualmente",
    RESUME_SAVED_SUCCESS: "CV actualizado correctamente",
    RESUME_SAVE_ERROR: "No se pudo guardar el CV",

    // Loading / Generating recommendations
    GENERATING_RECOMMENDATIONS_TITLE: "Generando recomendaciones",
    GENERATING_RECOMMENDATIONS_TEXT: "La IA está revisando la oferta laboral para sugerirte mejoras antes de continuar.",

    // Hero section
    HERO_TITLE: "Diseña tu currículum profesional",
    HERO_SUBTITLE: "Crea un CV moderno, estructurado y listo para destacar.",

    // Step labels (para la definición de steps)
    STEP_PERSONAL_LABEL: "Personal",
    STEP_JOB_DESCRIPTION_LABEL: "Oferta",
    STEP_SUMMARY_LABEL: "Resumen",
    STEP_EXPERIENCE_LABEL: "Experiencia",
    STEP_EDUCATION_LABEL: "Educación",
    STEP_SKILLS_LABEL: "Habilidades",
    STEP_LANGUAGES_LABEL: "Idiomas",
    STEP_PROJECTS_LABEL: "Proyectos",

    // Save status messages
    SAVE_STATUS_IDLE: "Editor listo",
    SAVE_STATUS_UNSAVED: "Cambios sin guardar",
    SAVE_STATUS_SAVING: "Guardando...",
    SAVE_STATUS_SAVED: "Guardado automáticamente",
    SAVE_STATUS_ERROR: "No se pudo guardar",

    // Save button
    SAVE_BUTTON_LOADING: "Guardando...",
    SAVE_BUTTON: "Guardar cambios",
  },

  RESUME_GENERATE: {
    LOADING_MESSAGE_1: "Preparando la información del currículum...",
    LOADING_MESSAGE_2: "Normalizando secciones y formato...",
    LOADING_MESSAGE_3: "Generando PDF con LaTeX...",
    LOADING_MESSAGE_4: "Preparando vista previa y descarga...",

    INITIAL_STATUS: "Preparando generación del CV...",
    SENDING_STATUS: "Enviando información al servidor...",
    GENERATING_STATUS: "Generando PDF con LaTeX...",
    SUCCESS_STATUS: "CV generado correctamente.",
    ERROR_STATUS: "Error al generar el CV.",

    GENERATING_TITLE: "Generando tu currículum",
    SUCCESS_TITLE: "Tu currículum",
    ERROR_TITLE: "No pudimos generar tu CV",

    BACK_TO_EDIT_BUTTON: "Volver a editar",
    RETRY_BUTTON: "Intentar de nuevo",
    DOWNLOAD_BUTTON: "Descargar CV",
    GO_TO_DASHBOARD_BUTTON: "Ir al dashboard",

    ATS_PANEL_TITLE: "Análisis ATS",
    ATS_SCORE_LABEL: "Compatibilidad estimada",
    ATS_DISCLAIMER: "Esta puntuación es una estimación basada en los criterios típicos de los sistemas ATS, no una evaluación realizada por un sistema real. Los resultados pueden variar según el ATS específico que utilice cada empresa.",
    ATS_EMPTY: "No se pudo generar el análisis ATS.",
    ATS_STRENGTHS_TITLE: "Fortalezas",

    ATS_WEAKNESSES_TITLE: "Áreas de mejora",
    ATS_RECOMMENDATIONS_TITLE: "Recomendaciones",
  },

  RESUME_OPTIMIZE: {
    INITIAL_STATUS: "Preparando optimización con IA...",
    ANALYZING_STATUS: "Analizando el CV final como un sistema ATS...",
    ERROR_STATUS: "No se pudo optimizar el CV con IA.",
    TITLE: "Optimizando tu currículum",
    HINT_TEXT: "Estamos optimizando tu CV, analizando su compatibilidad ATS y preparando tu PDF final.",
    RETRY_BUTTON: "Intentar nuevamente",
    GENERATE_ORIGINAL_BUTTON: "Generar CV original",
  },

  ERROR_BOUNDARY: {
    BADGE: "Error",
    DEFAULT_TITLE: "Ocurrió un error inesperado",
    DEFAULT_MESSAGE: "No se pudo cargar esta página.",
    FALLBACK_MESSAGE: "Algo salió mal en la aplicación.",
    GO_HOME_BUTTON: "Volver al inicio",
    GO_DASHBOARD_BUTTON: "Ir al dashboard",
  },

  HEADER: {
    LOGO_TEXT: "ResumeBuilder",
    THEME_LIGHT: "claro",
    THEME_DARK: "oscuro",
    THEME_TOGGLE_ARIA: "Cambiar a modo",
    DASHBOARD_LINK: "Dashboard",
    PROFILE_TITLE: "Perfil de",
    LOGOUT_BUTTON: "Salir",
    LOGIN_LINK: "Iniciar sesión",
    REGISTER_LINK: "Comenzar",
  },

  CONFIRM_DIALOG: {
    DEFAULT_CANCEL_LABEL: "Cancelar",
  },

  
} as const;