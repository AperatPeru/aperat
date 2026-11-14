#!/usr/bin/env python3
"""
Generates the official high-resolution composite image for APERAT's
"Parte de un movimiento global" section on /sobre-nosotros/ and /en/about-us/.

Combines:
- HI-assembly.webp (Humanists International General Assembly hall photo)
- hi-logo.svg (Humanists International official vector logo)

Outputs:
- assets/img/about/about_movimiento_global.webp
"""

import os
from PIL import Image, ImageDraw, ImageFilter

REPO_ROOT = "/var/www/html/aperat"
ASSEMBLY_PATH = os.path.join(REPO_ROOT, "assets/img/about/HI-assembly.webp")
LOGO_SVG_PATH = os.path.join(REPO_ROOT, "assets/img/logos/hi-logo.svg")
OUTPUT_WEBP = os.path.join(REPO_ROOT, "assets/img/about/about_movimiento_global.webp")
TEMP_LOGO_PNG = "/tmp/hi_logo_rendered.png"

def render_svg_to_png(svg_path, out_png):
    cmd = f"convert -background none -density 300 '{svg_path}' '{out_png}'"
    res = os.system(cmd)
    if res != 0 or not os.path.exists(out_png):
        raise RuntimeError(f"Failed to render SVG {svg_path} via ImageMagick")

def create_rounded_mask(size, radius):
    w, h = size
    scale = 4  # 4x supersampling for ultra-crisp antialiasing
    mask_large = Image.new('L', (w * scale, h * scale), 0)
    draw = ImageDraw.Draw(mask_large)
    draw.rounded_rectangle([0, 0, w * scale - 1, h * scale - 1], radius=radius * scale, fill=255)
    return mask_large.resize((w, h), Image.Resampling.LANCZOS)

def create_drop_shadow(card_size, radius, offset=(0, 16), blur=32, color=(2, 34, 60, 45)):
    w, h = card_size
    pad = blur * 3
    sw = w + pad * 2
    sh = h + pad * 2
    shadow_layer = Image.new('RGBA', (sw, sh), (0, 0, 0, 0))
    draw = ImageDraw.Draw(shadow_layer)
    x0, y0 = pad + offset[0], pad + offset[1]
    draw.rounded_rectangle([x0, y0, x0 + w, y0 + h], radius=radius, fill=color)
    shadow_blurred = shadow_layer.filter(ImageFilter.GaussianBlur(blur))
    return shadow_blurred, pad

def generate_composition():
    print("1. Rendering hi-logo.svg to high-DPI PNG...")
    render_svg_to_png(LOGO_SVG_PATH, TEMP_LOGO_PNG)

    CANVAS_W = 1200
    CANVAS_H = 1340
    canvas = Image.new('RGBA', (CANVAS_W, CANVAS_H), (0, 0, 0, 0))

    # Photo card specs
    PHOTO_W = 860
    PHOTO_H = 1200
    PHOTO_RADIUS = 32
    PHOTO_X = 40
    PHOTO_Y = 40
    PHOTO_CROP_X = 220

    # Badge card specs
    BADGE_W = 500
    BADGE_H = 650
    BADGE_RADIUS = 28
    BADGE_X = 660  # overlaps photo by 240px, right margin 40px
    BADGE_Y = 530  # bottom at 1180px, 60px above photo bottom

    # 1. Process Photo Card
    print("2. Processing HI-assembly photo...")
    ass = Image.open(ASSEMBLY_PATH).convert('RGB')
    aw, ah = ass.size  # 960x540
    crop_w = int(ah * (PHOTO_W / PHOTO_H))  # 387px
    photo_cropped = ass.crop((PHOTO_CROP_X, 0, PHOTO_CROP_X + crop_w, ah))
    photo_scaled = photo_cropped.resize((PHOTO_W, PHOTO_H), Image.Resampling.LANCZOS)
    # Subtle unsharp mask to ensure delegates and stage details remain crisp
    photo_crisp = photo_scaled.filter(ImageFilter.UnsharpMask(radius=1.2, percent=45, threshold=2))

    photo_mask = create_rounded_mask((PHOTO_W, PHOTO_H), PHOTO_RADIUS)
    photo_card = Image.new('RGBA', (PHOTO_W, PHOTO_H), (0, 0, 0, 0))
    photo_card.paste(photo_crisp, (0, 0))
    photo_card.putalpha(photo_mask)

    # Photo drop shadows (ambient + contact)
    sh_ambient, pad_a = create_drop_shadow((PHOTO_W, PHOTO_H), PHOTO_RADIUS, offset=(0, 20), blur=36, color=(2, 34, 60, 42))
    canvas.alpha_composite(sh_ambient, (PHOTO_X - pad_a, PHOTO_Y - pad_a))
    sh_contact, pad_c = create_drop_shadow((PHOTO_W, PHOTO_H), PHOTO_RADIUS, offset=(0, 6), blur=14, color=(2, 34, 60, 28))
    canvas.alpha_composite(sh_contact, (PHOTO_X - pad_c, PHOTO_Y - pad_c))

    # Paste photo card
    canvas.alpha_composite(photo_card, (PHOTO_X, PHOTO_Y))

    # 2. Process Badge Card
    print("3. Processing Humanists International logo badge...")
    badge_card = Image.new('RGBA', (BADGE_W, BADGE_H), (0, 0, 0, 0))
    badge_draw = ImageDraw.Draw(badge_card)
    badge_draw.rounded_rectangle(
        [0, 0, BADGE_W - 1, BADGE_H - 1],
        radius=BADGE_RADIUS,
        fill=(255, 255, 255, 255),
        outline=(220, 230, 240, 180),
        width=1
    )

    # Load rendered vector logo
    hi_logo = Image.open(TEMP_LOGO_PNG).convert('RGBA')
    lw, lh = hi_logo.size
    target_logo_w = int(BADGE_W * 0.72)  # 360px
    target_logo_h = int(target_logo_w * (lh / lw))  # 295px
    logo_scaled = hi_logo.resize((target_logo_w, target_logo_h), Image.Resampling.LANCZOS)

    logo_x = (BADGE_W - target_logo_w) // 2
    logo_y = (BADGE_H - target_logo_h) // 2
    badge_card.alpha_composite(logo_scaled, (logo_x, logo_y))

    # Badge drop shadows (elevation over photo + sharp contact)
    b_sh_elevation, b_pad_e = create_drop_shadow((BADGE_W, BADGE_H), BADGE_RADIUS, offset=(-3, 22), blur=38, color=(2, 34, 60, 52))
    canvas.alpha_composite(b_sh_elevation, (BADGE_X - b_pad_e, BADGE_Y - b_pad_e))
    b_sh_contact, b_pad_c = create_drop_shadow((BADGE_W, BADGE_H), BADGE_RADIUS, offset=(-4, 8), blur=14, color=(2, 34, 60, 32))
    canvas.alpha_composite(b_sh_contact, (BADGE_X - b_pad_c, BADGE_Y - b_pad_c))

    # Paste badge card
    canvas.alpha_composite(badge_card, (BADGE_X, BADGE_Y))

    # 3. Save Final WebP
    print(f"4. Saving to {OUTPUT_WEBP}...")
    canvas.save(OUTPUT_WEBP, 'WEBP', quality=95, method=6)
    size_kb = os.path.getsize(OUTPUT_WEBP) / 1024
    print(f"Success! Generated {OUTPUT_WEBP} ({CANVAS_W}x{CANVAS_H}, {size_kb:.1f} KB)")

if __name__ == "__main__":
    generate_composition()
