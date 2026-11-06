#!/usr/bin/env python3
"""
Script de optimización de imágenes para APERAT.
Convierte todas las imágenes (JPG, JPEG, PNG) a formato WebP optimizado
ajustando su tamaño máximo y compresión según su función en el sitio web.
"""

import os
import sys
from pathlib import Path
from PIL import Image

# Configuración de límites por directorio / categoría de imagen
RULES = {
    'hero': {'max_width': 1920, 'quality': 82},
    'articles': {'max_width': 1200, 'quality': 80},
    'principles': {'max_width': 1000, 'quality': 82},
    'community': {'max_width': 1000, 'quality': 82},
    'whc': {'max_width': 1200, 'quality': 82},
    'partners': {'max_width': 500, 'quality': 85},
    'logos': {'max_width': 600, 'quality': 90},
    'default': {'max_width': 1200, 'quality': 82}
}

def get_rule_for_path(path: Path):
    path_str = str(path).lower()
    for key, rule in RULES.items():
        if f"/{key}/" in path_str:
            return rule
    return RULES['default']

def optimize_image(src_path: Path):
    rule = get_rule_for_path(src_path)
    dest_path = src_path.with_suffix('.webp')
    
    try:
        with Image.open(src_path) as img:
            # Preservar o manejar transparencia
            has_alpha = img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info)
            if has_alpha:
                img = img.convert('RGBA')
            else:
                img = img.convert('RGB')
            
            # Redimensionar si excede max_width
            w, h = img.size
            if w > rule['max_width']:
                new_w = rule['max_width']
                new_h = int(h * (new_w / w))
                img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
            
            # Guardar en WebP
            img.save(dest_path, 'WEBP', quality=rule['quality'], method=6)
            
            orig_size = src_path.stat().st_size
            new_size = dest_path.stat().st_size
            savings = (1 - (new_size / orig_size)) * 100
            print(f"✓ {src_path.name} -> {dest_path.name} [{orig_size // 1024}KB -> {new_size // 1024}KB] ({savings:.1f}% ahorro)")
            return True
    except Exception as e:
        print(f"✗ Error al procesar {src_path}: {e}", file=sys.stderr)
        return False

def scan_and_optimize(base_dir: Path):
    extensions = {'.jpg', '.jpeg', '.png'}
    count = 0
    for root, _, files in os.walk(base_dir):
        for f in files:
            path = Path(root) / f
            if path.suffix.lower() in extensions:
                if optimize_image(path):
                    count += 1
    print(f"\nTotal imágenes procesadas: {count}")

if __name__ == '__main__':
    base = Path(__file__).resolve().parent.parent / 'assets' / 'img'
    if not base.exists():
        base = Path('/var/www/html/aperat/assets/img')
    print(f"Escaneando directorio: {base}")
    scan_and_optimize(base)

