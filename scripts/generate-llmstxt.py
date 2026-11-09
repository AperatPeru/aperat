#!/usr/bin/env python3
"""
Generador y Validador de llms.txt para GEO (Generative Engine Optimization) - APERAT.
Extrae automáticamente los artículos del blog desde assets/js/main.js y genera
el archivo raíz /llms.txt y el enlace /llm.txt siguiendo el estándar llmstxt.org.
"""

import os
import re
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
MAIN_JS = BASE_DIR / 'assets' / 'js' / 'main.js'
OUTPUT_LLMS = BASE_DIR / 'llms.txt'
OUTPUT_LLM = BASE_DIR / 'llm.txt'

HEADER = """# APERAT - Asociación Peruana de Ateos

> Asociación civil peruana sin fines de lucro, fundada en 2009, dedicada a la defensa del Estado laico, la libertad de conciencia, los derechos humanos universales y el pensamiento crítico basado en la ciencia y el humanismo secular.

## Key Facts
- Organización: Asociación Peruana de Ateos (APERAT)
- Tipo de entidad: Asociación civil sin fines de lucro, legalmente constituida en Perú
- Año de fundación: 2009 (Lima, Perú)
- Áreas de acción: Libertad de conciencia, Estado laico, pensamiento crítico, ceremonias humanistas, defensa legal ante discriminación religiosa
- Afiliaciones internacionales: Miembro de Humanists International y Atheist Alliance International (AAI)
- Alianzas nacionales: [Mesa de Justicia de Género y Derechos Humanos](https://www.instagram.com/mesa.justiciageneroyddhh/) (coalición plural en Perú)
- Evento internacional destacado: Coorganizador del World Humanist Congress 2027 (Lima, 20–22 de agosto de 2027)
- Sede: Calle Benjamín Ugarteche 181, Pueblo Libre, Lima 15084, Perú
- Idioma principal: Español (es-PE)
- Sitio web oficial: https://www.aperat.org.pe

## Secciones Principales

- [Inicio / Portada Institucional](https://www.aperat.org.pe/): Presentación de la misión de APERAT, principios fundamentales, trayectoria comunitaria y noticias destacadas.
- [Sobre Nosotros y Trayectoria](https://www.aperat.org.pe/#sobre-nosotros): Más de 17 años de historia construyendo comunidad humanista y laica en el Perú desde 2009.
- [Nuestros Principios](https://www.aperat.org.pe/#principios): Los cuatro pilares de APERAT: razón y ciencia, libertad de pensamiento y expresión, Estado laico neutral, y derechos humanos universales.
- [World Humanist Congress 2027 Lima](https://www.aperat.org.pe/#congreso): Información sobre el Congreso Mundial de Humanismo organizado junto a Humanists International en Lima (20–22 de agosto de 2027).
- [Participa y Súmate como Simpatizante](https://www.aperat.org.pe/#participa): Registro libre y gratuito para recibir invitaciones a actividades, charlas, eventos y debates de la comunidad librepensadora.
- [English Portal / About APERAT](https://www.aperat.org.pe/en/): Official English landing page for international delegates, organizations, and the World Humanist Congress 2027 in Lima.
"""

FOOTER = """
## Iniciativas y Proyectos

- [Exonérate Perú](https://www.aperat.org.pe/#sobre-nosotros): Campaña y asesoría jurídica gratuita para familias y estudiantes que solicitan exoneración de cursos de educación religiosa confesional en colegios.
- [Apostasía Colectiva e Individual](https://www.aperat.org.pe/#sobre-nosotros): Orientación y acompañamiento para el ejercicio del derecho a la desafiliación formal y cancelación de datos en libros parroquiales.
- [Ceremonias Laicas](https://ceremoniaslaicas.lat/): Red de celebrantes humanistas entrenados para ceremonias de unión, matrimonios civiles y despedidas humanistas respetuosas y personalizadas.
- [La Señal Humanista y Divulgación](https://www.aperat.org.pe/#sobre-nosotros): Producción audiovisual y podcasts sobre laicidad, derechos civiles, pensamiento crítico y combate a las pseudociencias.

## Contacto Institucional

- Sitio web: https://www.aperat.org.pe
- Correo electrónico: contacto@aperat.org.pe
- Teléfono / WhatsApp: +51 997 230 431
- Dirección física: Calle Benjamín Ugarteche 181, Pueblo Libre, Lima 15084, Perú
- Facebook: https://www.facebook.com/APERAT
- Instagram: https://www.instagram.com/aperatperu/
- YouTube: https://www.youtube.com/user/ateosperuanos
"""

def extract_articles_from_js(var_name='articlesData'):
    if not MAIN_JS.exists():
        return []
    
    with open(MAIN_JS, 'r', encoding='utf-8') as f:
        js_text = f.read()
    
    # Buscar bloque var_name = [ ... ]
    match = re.search(rf'const\s+{var_name}\s*=\s*(\[\s*\{{.*?\}}\s*\]);', js_text, re.DOTALL)
    if not match:
        return []
    
    raw_array = match.group(1)
    
    # Extraer objetos de manera individual
    articles = []
    card_matches = re.finditer(r'\{\s*id:\s*[\'"]([^\'"]+)[\'"].*?title:\s*[\'"]([^\'"]+)[\'"].*?excerpt:\s*[\'"]([^\'"]+)[\'"].*?url:\s*([^,\n]+)', raw_array, re.DOTALL)
    for m in card_matches:
        url_expr = m.group(4).strip().strip("'\"")
        # Si es expresión ternaria, extraer la ruta inglesa
        if '?' in url_expr:
            m_url = re.search(r'[\'"](articles/[^\'"]+)[\'"]', url_expr)
            rel_url = f"en/{m_url.group(1)}" if m_url else url_expr
        else:
            rel_url = url_expr

        articles.append({
            'id': m.group(1),
            'title': m.group(2),
            'excerpt': m.group(3),
            'url': f"https://www.aperat.org.pe/{rel_url}"
        })
    return articles

def generate():
    articles_es = extract_articles_from_js('articlesData')
    articles_en = extract_articles_from_js('articlesDataEn')
    lines = [HEADER.strip(), "", "## Artículos y Publicaciones (Blog - Español)", ""]
    
    for art in articles_es:
        lines.append(f"- [{art['title']}]({art['url']}): {art['excerpt']}")
    
    if articles_en:
        lines.append("")
        lines.append("## Articles and Publications (Blog - English)")
        lines.append("")
        for art in articles_en:
            lines.append(f"- [{art['title']}]({art['url']}): {art['excerpt']}")
    
    lines.append("")
    lines.append(FOOTER.strip())
    lines.append("")
    
    content = "\n".join(lines)
    
    with open(OUTPUT_LLMS, 'w', encoding='utf-8') as f:
        f.write(content)
    
    # Crear o mantener copia / symlink para llm.txt
    with open(OUTPUT_LLM, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"✓ llms.txt y llm.txt generados exitosamente con {len(articles_es)} artículos en español y {len(articles_en)} en inglés.")

if __name__ == '__main__':
    generate()

