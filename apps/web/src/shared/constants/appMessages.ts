export const APP_MESSAGES = {
  GENERIC_ERROR:
    "Ocurrió un error inesperado. Intenta nuevamente.",

  NETWORK_ERROR:
    "No se pudo conectar con el servidor.",

  UNAUTHORIZED:
    "Tu sesión expiró. Inicia sesión nuevamente.",

  PDF: {
    GENERATING:
      "Generando tu currículum en PDF...",

    FAILED:
      "No se pudo generar el PDF.",
  },

  AI: {
    OPTIMIZING:
      "Optimizando tu CV con IA...",

    ANALYZING:
      "Analizando compatibilidad ATS...",

    FAILED:
      "No se pudo completar la optimización con IA.",
  },

  PROFILE: {
    SAVED:
      "Perfil actualizado correctamente.",

    FAILED:
      "No se pudo actualizar el perfil.",
  },

  PROFILE_PAGE: {
    LOADING: "Cargando perfil...",
    TITLE: "Perfil profesional",
    DESCRIPTION:
      "Guarda toda tu información profesional para reutilizarla automáticamente en futuros currículums.",
    SAVING: "Guardando cambios...",
    LOADED: "Perfil cargado",
    SAVE_ERROR: "No se pudieron guardar los cambios",
    SAVE_BUTTON_LOADING: "Guardando...",
    SAVE_BUTTON_DIRTY: "Guardar cambios",
    SAVE_BUTTON_SAVED: "Guardado",
  },
} as const;