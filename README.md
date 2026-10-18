# CV web · David Peñas Miarnau

Proyecto Astro con HTML semántico, CSS y JavaScript nativo. Adaptado a los componentes y la navegación ClinicSport aportados por el usuario. Recrea el wireframe aprobado con siete secciones, colores DPM y fotografías locales. No utiliza React, Tailwind, fuentes remotas ni servicios de terceros para funcionar.

## Ejecutar

Requisito: Node.js 22.12 o superior (recomendado Node.js 24).

```bash
npm ci
npm run dev
```

Abre la dirección local que indique Astro. Para generar la web estática:

```bash
npm run build
npm run preview
```

La carpeta `dist/` incluida contiene la compilación ya preparada. Puedes subir **su contenido** al directorio público de tu hosting para alojar el CV en la raíz de un dominio. Para una subcarpeta, configura `base` en `astro.config.mjs` y vuelve a compilar. Astro ajusta las rutas de imágenes, CSS y JavaScript al compilar.

## Archivos principales

```text
src/
  pages/index.astro       Estructura HTML y siete secciones
  layouts/BaseLayout.astro Metadatos, SEO básico y carga de CSS/JS
  components/Icon.astro   Iconos SVG locales
  components/Brand.astro  Marca personal
  components/Header.astro Cabecera y menú móvil
  components/SlideNavigation.astro Rail y flechas por secciones
  components/FullScreenSection.astro Fondos y estructura de pantalla completa
  data/cv.js             Datos de contacto, competencias, proyectos y formación
  styles/global.css      Diseño, colores y versiones móvil/tablet/escritorio
  styles/fullscreen.css  Adaptación de estructura ClinicSport a colores DPM
  scripts/navigation.js  Menú, rueda/trackpad, teclado y navegación por secciones
public/
  images/david.webp      Retrato suministrado
  images/office.webp     Fotografía ambiental generada para este proyecto
  images/city.webp       Fotografía ambiental generada de Barcelona
  favicon.svg            Favicon con iniciales
```

## Editar tu CV

- Contacto, competencias, proyectos y formación: `src/data/cv.js`.
- Presentación, perfil y experiencia profesional: `src/pages/index.astro`.
- Colores y medidas generales: variables al principio de `src/styles/global.css`.
- Imágenes: sustituye los archivos de `public/images/` manteniendo los nombres o actualiza las referencias.
- Dominio: añade `site: 'https://tu-dominio.es'` en `astro.config.mjs` cuando conozcas el definitivo. Después podrás incorporar canonical, imagen social absoluta y sitemap con el dominio real.

## Comportamiento

- Ordenador: cabecera fija, siete pantallas con fondos completos y franja lateral permanente, siguiendo la estructura de los componentes de ClinicSport. En pantallas de más de 900 px de ancho y 650 px de alto con puntero preciso, la rueda/trackpad avanza una sección por gesto; la inercia residual se ignora.
- Las flechas laterales llevan a la sección anterior o siguiente según la posición actual, también después de desplazarte manualmente. La flecha de subir queda desactivada al inicio y la de bajar al final.
- Tablet: menú plegable y redistribución de contenido; el texto conserva su altura natural y el scroll táctil permanece nativo.
- Móvil: imágenes en la zona superior con degradado vertical hacia el azul DPM, contenido apilado y rail lateral compacto. El contenido puede crecer sin recortes. Si alguna sección excede la altura visible, se desactiva la captura de la rueda en toda la página para permitir leer todo el contenido.
- En móvil (hasta 767 px) el scroll es continuo: `scroll-snap` queda desactivado incluso cuando hay contenido largo. No se recoloca automáticamente la pantalla al soltar el dedo. Las flechas y los enlaces siguen disponibles para navegar voluntariamente.
- Los proyectos muestran más información mediante desplegables HTML accesibles; no se han inventado direcciones web de los proyectos.
- Contacto con enlaces reales a email, teléfono y LinkedIn. No hay formulario ni backend.
- Teclado en modo escritorio: flechas arriba/abajo, PageUp/PageDown, Inicio/Fin y espacio. Los controles, enlaces y desplegables conservan sus teclas nativas.
- Se respeta `prefers-reduced-motion`. El contenido y los enlaces siguen disponibles sin JavaScript; el menú móvil se muestra completo en ese caso.

## Contenido y diseño

Incluye el nombre completo, experiencia TI, la especialización en ciberseguridad entre 2020 y 2024, etapa actual DPM, proyectos y formación. NUCLIO aparece completado en 2026. BIG school figura en Marketing Digital y en Inteligencia Artificial, este último en curso.

La navegación de cabecera es única y fija. En el wireframe se repetía para representar cada pantalla; en la web acompaña al visitante durante el recorrido.

Las fotografías ambientales son ilustrativas. Las tarjetas de proyecto utilizan composiciones gráficas propias, sin presentarlas como capturas reales de trabajos.

## Verificación realizada

- Compilación estática de Astro.
- Comprobación de referencias locales a archivos, anclas, siete secciones y textos solicitados.
- Sintaxis del JavaScript.
- No se ha realizado una comprobación visual en un navegador en este entorno. Revisa el resultado con `npm run dev` en tu ordenador, especialmente antes de publicarlo.

No se ha publicado el sitio. El ZIP contiene el proyecto editable y la carpeta estática `dist/`.
