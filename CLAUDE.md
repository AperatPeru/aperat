# Reglas de Desarrollo, GEO y Contenido de APERAT

Este repositorio alberga el sitio web estático oficial de la **Asociación Peruana de Ateos (APERAT)** alojado en GitHub Pages.

---

## 🤖 Regla Obligatoria: Estándar `llms.txt` y `llm.txt` para GEO (Generative Engine Optimization)

Para maximizar la citabilidad y visibilidad en motores de búsqueda basados en IA (ChatGPT, Perplexity, Claude, Gemini, Google AI Overviews), el sitio implementa el estándar `llms.txt` (y su alias `llm.txt`) en la raíz del dominio (`https://www.aperat.org.pe/llms.txt`).

### 1. Criterios de Calidad GEO Aplicados
- **Título oficial (H1)**: `# APERAT - Asociación Peruana de Ateos`.
- **Descripción factual (Blockquote)**: Resumen conciso e institucional de menos de 200 caracteres, libre de adjetivos publicitarios vacíos.
- **Key Facts**: Datos de referencia rápida para respuestas directas de IAs (año de fundación, sede en Lima, tipo de personería jurídica, alianzas con Humanists International, etc.).
- **URLs canónicas y absolutas**: Todas las rutas deben ser URLs completas con `https://www.aperat.org.pe/...`.
- **Descripciones específicas (10-30 palabras)**: Cada página y artículo incluye un resumen explicativo que permite a las IAs citar la fuente idónea según la consulta del usuario.
- **Ambos alias disponibles**: Se mantienen `llms.txt` (estándar oficial) y `llm.txt` (fallback comúnmente consultado por ciertos agentes).

### 2. Actualización Obligatoria ante Nuevo Contenido
- Cada vez que se agregue o modifique un artículo del blog o una sección principal, **DEBE actualizarse `llms.txt`**.
- Se cuenta con el script automatizado:
  ```bash
  python3 scripts/generate-llmstxt.py
  ```
- Este script lee la lista de artículos desde `assets/js/main.js` y genera automáticamente la versión sincronizada de `llms.txt` y `llm.txt`.
- El hook `.git/hooks/pre-commit` ejecuta este script automáticamente antes de cada confirmación en Git.

---

## 📸 Regla Obligatoria: Optimización de Imágenes (WebP)

1. **Formato Exclusivo**:
   - Todas las imágenes fotográficas e ilustraciones destinadas a la web (portada, principios, blog/artículos, aliados) **DEBEN estar en formato `.webp`**.
   - Los únicos archivos no WebP permitidos son logotipos vectoriales en `.svg` o el favicon del navegador.

2. **Dimensiones y Compresión Recomendadas**:
   - **Hero / Portadas**: Ancho máximo `1920px`, calidad WebP `82%`.
   - **Artículos del Blog / Destacadas**: Ancho máximo `1200px`, calidad WebP `80%`.
   - **Principios y Comunidad**: Ancho máximo `1000px`, calidad WebP `82%`.
   - **Logos / Aliados**: Ancho máximo `500px - 600px`, calidad WebP `85% - 90%` (con canal alfa/transparencia preservado).

3. **Automatización antes de Commit / Push**:
   - Al agregar una imagen en JPG o PNG, ejecutar:
     ```bash
     python3 scripts/optimize-images.py
     ```
   - El hook en `.git/hooks/pre-commit` procesará automáticamente las imágenes en `assets/img/` a `.webp` antes de registrar el commit.
   - En el código HTML/JS/CSS **siempre se debe referenciar el archivo `.webp`**, nunca la fuente original en JPG o PNG.

---

## 📝 Regla de Artículos del Blog

- **Estructura**: Todo artículo nuevo en español debe alojarse en `articulos/<slug-del-articulo>/index.html`, de modo que su URL pública sea `/articulos/<slug-del-articulo>/` (sin extensión `.html`). En inglés se usa `en/articles/<slug-del-articulo>/index.html`, con URL pública `/en/articles/<slug-del-articulo>/`.
- **Autoría**: Por directriz editorial de APERAT, **ningún artículo debe mostrar nombres de autores personales**; se mantiene siempre la firma institucional de la asociación.
- **Categorías oficiales permitidas**:
  1. `Razón y filosofía`
  2. `Ciencia y pensamiento crítico`
  3. `Sociedad y humanismo`
  4. `Democracia y laicidad`
  5. `Educación y libertad de conciencia`
  6. `Actividades de APERAT`
- **Registro en el Carrusel**: Registrar el nuevo artículo en el arreglo `articlesData` de `assets/js/main.js` indicando su `date` en formato `YYYY-MM-DD` para que el carrusel lo ordene automáticamente de manera descendente.
- **Sitemap**: Incluir la URL canónica en `sitemap.xml` con prioridad `0.9`.

---

## ⚡ Rendimiento y Caché
- Al modificar `assets/css/main.css` o `assets/js/main.js`, incrementar el parámetro de versión de caché en todas las páginas que los carguen (ejemplo: `?v=2027.X` o `?v=2026.X`).
- **URLs públicas**: Todas las páginas y artículos usan directorios sin extensión: `/sobre-nosotros/`, `/que-hacemos/`, `/laicidad-y-derechos/` y `/articulos/<slug>/`. Las URL antiguas `.html` se conservan únicamente como redirecciones `noindex, follow`.
