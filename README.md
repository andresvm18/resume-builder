# Resume Builder (cambiar nombre)

## Visión del producto
Una plataforma web que permite a usuarios crear currículums profesionales, optimizados progresivamente para sistemas ATS, con personalización según ofertas laborales y generación en PDF.

## Fase 0 - Diseño del Sistema y Validación UX

### Objetivo

Definir con claridad la arquitectura técnica, la experiencia del usuario y la estructura funcional del producto antes del desarrollo. Esta fase busca reducir retrabajo, anticipar riesgos y establecer una base sólida para la ejecución de las siguientes etapas.

### Funcionalidades/Entregables
1. Diseño de experiencia de usuario (UX)
    - Definición del flujo completo del usuario desde el ingreso hasta la exportación del CV.
    - Wireframes de pantallas clave:
      - Inicio / Landing Page
      - Registro / Inicio de sesión
      - Dashboard personal
      - Formulario de creación de CV
      - Vista previa del CV
      - Página de análisis ATS
    - Validación del recorrido para asegurar simplicidad, claridad y eficiencia.

2. Arquitectura técnica inicial
    - Definición de la estructura del frontend y backend.
    - Separación modular de servicios:
      - Gestión de usuarios
      - Gestión de CVs
      - Motor ATS
      - IA de redacción
      - Exportación PDF
    - Diseño de API REST escalable.

3. Modelo de datos

    Diseñar el esquema de base de datos considerando escalabilidad y persistencia.
    
    Entidades clave:
    - Usuario
    - Perfil profesional
    - Currículum
    - Versión de CV
    - Oferta laboral
    - Resultado ATS
    - Historial de optimizaciones

4. Sistema de identidad y persistencia del usuario

    Incorporar una capa de autenticación y almacenamiento para transformar la herramienta en una plataforma. Esto permitirá:
    - Registro e inicio de sesión.
    - Guardado automático de CVs.
    - Múltiples versiones de currículum por usuario.
    - Historial de modificaciones.
    - Reutilización de información para futuras aplicaciones.

## Resultado Esperado

Contar con un diseño estratégico, técnico y funcional completamente definido antes del desarrollo. Esta fase debe producir una hoja de ruta validada, una arquitectura preparada para crecimiento y un marco ético/técnico que garantice calidad y sostenibilidad.

## Criterios de Cierre
- Existe un flujo de usuario validado y documentado.
- El modelo de datos contempla escalabilidad y persistencia.
- La arquitectura técnica está definida por módulos.
- El sistema de identidad está diseñado e integrado al roadmap.
- El ATS Score cuenta con fundamentos claros y documentados.
- Las reglas de generación con IA están establecidas formalmente.
- El equipo (o desarrollador) puede iniciar Fase 1 sin ambigüedades.

## Fase 1 - MVP Funcional

### Objetivo 
Desarrollar una versión funcional de la plataforma que permita al usuario:
  - Ingresar su información profesional mediante un formulario estructurado
  - Generar un currículum profesional con formato ATS-friendly
  - Exportar el currículum en PDF utilizando LaTeX
  - Visualizar y descargar el documento generado

### Funcionalidades
1. Formulario dinámico multi-step 

    Se implementa un sistema de formulario por pasos que permite capturar información del usuario de forma organizada:

    - Datos personales
    - Resumen profesional
    - Experiencia
    - Educación
    - Habilidades
    - Idiomas
    - Proyectos

    Características:

      - Navegación entre pasos (wizard)
      - Componentes reutilizables por sección
      - Manejo de estado centralizado con custom hook (useResumeBuilder)
      - Actualización dinámica de datos

2. Generación de CV en PDF (LaTeX)

    Se implementa un sistema de generación de currículum utilizando LaTeX en el backend:

    - Template ATS-friendly estructurado
    - Reemplazo dinámico de contenido desde el frontend
    - Sanitización de texto para evitar errores en LaTeX
    - Compilación del documento con pdflatex
    - Generación de PDF listo para descarga

3. Integración Frontend ↔ Backend

    - Envío de datos del formulario al backend mediante API REST
    - Endpoint /api/resume/generate
    - Recepción del PDF como respuesta binaria
    - Manejo de estados de carga y error

4. Descarga automática del CV
    - Generación automática del archivo PDF al completar el proceso
    - Descarga automática en el navegador
    - Nombre dinámico del archivo basado en el nombre del usuario (sin espacios ni caracteres especiales)

5. Vista previa del PDF
    - Visualización del CV generado dentro de la aplicación
    - Uso de iframe para renderizar el PDF
    - Mejora de experiencia de usuario sin necesidad de descarga inmediata

6. Página de generación de CV

    Se implementa una página dedicada al proceso de generación:

    - Estados de progreso:
      - Enviando datos
      - Generando PDF
      - Completado
      - Error
    - Indicador visual de carga (loader)
    - Opciones:
      - Descargar CV
      - Volver a editar


7. Estructura modular del frontend

    Arquitectura organizada por módulos:

    - landing
    - auth (login/register UI)
    - dashboard (con datos mock)
    - resume-builder (core del sistema)
    - shared (componentes globales)

    Esto permite escalabilidad y mantenibilidad del proyecto.

8. Backend básico funcional
    - Servidor Express configurado
    - Controlador para generación de CV
    - Servicio de generación LaTeX
    - Sistema de archivos temporal para compilación

### Stack
  #### Frontend
  - React + TypeScript
  - CSS modular (sin framework externo)
  - React Hook Form

  #### Backend
  - Node.js + Express

  #### PDF
  - LaTeX (pdflatex)

  ### Base de datos
  - PostgreSQL + Prisma

## Resultado Esperado 
Entregar una plataforma web funcional que permita a los usuarios crear currículums profesionales de forma estructurada, rápida y eficiente.

El sistema debe:

- Guiar al usuario mediante un flujo claro y segmentado
- Transformar datos en un documento profesional ATS-friendly
- Generar un PDF de alta calidad utilizando LaTeX
- Proveer una experiencia fluida desde la captura de datos hasta la descarga del documento

Además, esta fase establece una base sólida para futuras mejoras como persistencia de datos, optimización ATS y generación automática con IA.

## Criterios de Cierre
- El usuario puede completar todas las secciones del formulario sin errores críticos
- El sistema genera un currículum estructurado y consistente
- La exportación a PDF funciona correctamente
- El archivo PDF se descarga automáticamente con nombre personalizado
- El usuario puede visualizar el CV antes o después de descargarlo
- El tiempo de generación del CV es razonable (menos de 10 segundos en condiciones normales)



## Fase 2 - Motor de Optimización ATS

### Objetivo
Convertirlo en producto diferencial.

### Funcionalidades
1. Input de oferta laboral
2. Extracción de palabras clave
    - Tecnologías
    - Habilidades blandas
    - Certificaciones
    - Verbos clave

3. Matching Engine **(esto hay que investigarlo más a ver cuál sirve más)**
    
    Compara oferta laboral vs CV y genera
    - Score ATS
    - Palabras faltantes
    - Recomendaciones
  
    En esta fase se implementará NLP simple + reglas heurísticas
      - **Paso 1:** extraer keywords del job description.
      - **Paso 2:** normalizar, aplicar lowercase, eliminar stopwords (artículos, preposiciones, pronombres) y aplicar stemming (proceso heurístico que elimina los sufijos y prefijos de las palabras para obtener su raíz)/lemmatization (proceso que implica reducir una palabra a su forma canónica o de diccionario)
      - **Paso 3:** Mapear coincidencias entre keywords del puesto y secciones del CV.
      - **Paso 4:** Comparar con el CV generado
      - **Paso 5:** Calcular score ATS (El ATS Score representa una estimación interna basada en criterios comunes de compatibilidad con sistemas de seguimiento de candidatos, y no sustituye evaluaciones reales de plataformas de reclutamiento.)
      ~~~
            ATS Score =
            (keyword_match * 0.4) +
            (section_completeness * 0.2) +
            (format_quality * 0.2) +
            (role_alignment * 0.2)
      ~~~

  ### Justificación de Pesos

1. Keyword Match (40%): Representa la coincidencia entre palabras clave del puesto y el contenido del CV ya que los sistemas ATS priorizan términos específicos relacionados con habilidades, tecnologías y certificaciones.
2. Section Completeness (20%): Evalúa si el CV contiene todas las secciones esenciales debido a que la ausencia de información relevante reduce interpretabilidad y competitividad.
3. Format Quality (20%): Mide estructura, legibilidad y compatibilidad con ATS porque un CV visualmente atractivo no siempre es técnicamente procesable. Este factor protege contra diseños incompatibles.
4. Role Alignment (20%): Determina qué tan coherente es el perfil con la vacante ya que más allá de palabras clave, el contenido debe reflejar experiencia alineada con el rol objetivo.


## Resultado Esperado
Transformar la plataforma en una solución diferenciada dentro del mercado laboral digital, evolucionando de un simple generador de currículums a una herramienta estratégica de optimización profesional.

En esta fase, el producto debe ser capaz de interpretar una oferta laboral, identificar sus elementos clave y compararlos con la información del CV del usuario para medir compatibilidad. Esto permitirá ofrecer un análisis objetivo sobre qué tan alineado está el perfil con la vacante, brindando métricas claras y accionables.

El sistema deberá entregar una puntuación estimada de desempeño ante filtros ATS, señalar palabras clave ausentes y proponer mejoras específicas para aumentar las probabilidades de éxito en procesos de selección. De esta forma, el usuario no solo obtiene un currículum bien diseñado, sino también una guía inteligente para adaptarlo estratégicamente a cada oportunidad laboral.

El resultado esperado es un producto con valor agregado real: una plataforma que no solo construye documentos, sino que ayuda a tomar decisiones y a mejorar la competitividad profesional del usuario en un entorno laboral cada vez más automatizado.


## Criterios de Cierre
- El sistema identifica correctamente palabras clave relevantes dentro de una oferta laboral.
- El motor de comparación detecta coincidencias y ausencias entre el CV y la vacante.
- Se genera un ATS Score consistente en pruebas repetidas con entradas similares.
- Las recomendaciones entregadas son claras, accionables y alineadas con la oferta laboral.
- El análisis se ejecuta en un tiempo razonable para mantener una experiencia fluida.


## Fase 3 - Asistente Inteligente de Redacción Profesional

### Objetivo

Transformar datos crudos del usuario en contenido profesional listo para CV.

### Funcionalidades
1. Generación de resumen profesional usando experiencia, habilidades y puesto objetivo
2. Reescritura de experiencia laboral transformando texto informal en bullets profesionales.
3. Optimización semántica para insertar palabras clave naturalmente.

~~~
  Reescribe la siguiente experiencia laboral para un currículum profesional. Mantén veracidad, usa lenguaje orientado a logros, evita inventar datos y redacta en formato bullet points.
~~~

### IA a utilizar

Falta decidir bien esto, para la Fase 1 y 2 no es necesario


## Resultado Esperado
Consolidar la plataforma como una solución avanzada mediante la incorporación de capacidades de IA generativa orientadas a elevar la calidad y efectividad del contenido profesional del usuario.

En esta fase, el sistema debe automatizar procesos que normalmente requieren tiempo, criterio editorial y experiencia en redacción profesional. A partir de la información proporcionada, la plataforma será capaz de generar resúmenes ejecutivos sólidos, transformar descripciones informales en logros y responsabilidades redactados de manera estratégica, y optimizar el contenido para alinearlo con estándares de reclutamiento modernos.

La integración de IA permitirá no solo ahorrar tiempo, sino también mejorar sustancialmente la presentación del perfil profesional, incorporando lenguaje preciso, impacto narrativo y adaptación semántica según los requerimientos del mercado laboral.

El resultado esperado es una solución avanzada que combina automatización, personalización y calidad profesional, posicionándose como una herramienta integral para la construcción, análisis y perfeccionamiento de currículums competitivos en entornos laborales altamente exigentes.

## Criterios de Cierre
- La IA genera contenido profesional basado únicamente en la información ingresada por el usuario.
- El texto producido mantiene coherencia, claridad y relevancia para el puesto objetivo.
- El contenido generado es editable antes de exportar.
- La herramienta reduce significativamente el tiempo de redacción manual del usuario.
- Las respuestas de la IA cumplen lineamientos de veracidad y no inventan experiencia o logros.