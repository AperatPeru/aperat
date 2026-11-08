---
name: APERAT Design System
description: The Secular Agora — A modern, accessible, civic visual system for freethought, reason, and human rights in Peru
colors:
  primary: "#023660"
  primary-dark: "#011f38"
  primary-light: "#034b85"
  secondary: "#07A5D6"
  secondary-dark: "#0584ab"
  secondary-light: "#44bbe0"
  secondary-tint: "#e7f6fd"
  secondary-tint-20: "#f2faff"
  tertiary: "#424D59"
  tertiary-light: "#576575"
  white: "#ffffff"
  black: "#0c1015"
  text-main: "#2b3642"
  text-muted: "#5e6b78"
  text-light: "#8e9ca8"
  bg-page: "#ffffff"
  bg-alt: "#f0f7fb"
  bg-footer: "#eaf5fc"
  border-light: "rgba(2, 54, 96, 0.08)"
  border-subtle: "rgba(7, 165, 214, 0.15)"
typography:
  display:
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(2.4rem, 5.5vw, 4.4rem)"
    fontWeight: 700
    lineHeight: 1.14
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  title:
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.35
  body:
    fontFamily: "'Karla', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
    letterSpacing: "0.12em"
rounded:
  xs: "4px"
  sm: "8px"
  md: "14px"
  lg: "20px"
  xl: "28px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "12px 28px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.secondary-dark}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "14px 30px"
    typography: "{typography.label}"
  card-surface:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.lg}"
    padding: "24px"
---

# Design System: APERAT

## Overview

**Creative North Star: "The Secular Agora"**

The visual language of APERAT balances institutional authority with civic openness. Evoking an enlightened agora, the system provides high clarity, dignified contrast, and expansive breathing room. It is designed to represent reason, scientific curiosity, and universal rights without dogmatic solemnity, coldness, or aggressive confrontation.

The aesthetic pairs deep cosmic navy blues (anchor of institutional permanence) with luminous sky cyans (symbol of progressive clarity and forward-looking freethought). White and pale-blue paper tints dominate content surfaces, ensuring reading comfort and legibility across both desktop monitors and mobile devices in high ambient light.

**Key Characteristics:**
- **High legibility & civic dignity:** High-contrast text hierarchies, generous line spacing, and disciplined semantic color usage.
- **Layered atmospheric depth:** Surfaces remain flat at rest with delicate multi-stop shadows and subtle luminous highlights appearing on hover and interaction.
- **Confident & friendly tactility:** Pill-shaped actions, rounded interactive cards, and smooth cubic-bezier transitions that feel welcoming rather than rigid.
- **Bilingual architectural parity:** Symmetrical layout balance across Spanish and English surfaces.

## Colors

The palette is rooted in nautical and atmospheric tones, balancing the solemnity of legal advocacy with the vibrant optimism of freethought.

### Primary
- **Cosmic Navy** (`#023660`): The primary anchor of the brand. Used for major headings, navigation branding, header backgrounds, active state pills, and authoritative text elements. Evokes institutional longevity and stability.
- **Deep Abyss** (`#011f38`): Deepest tier shade used for high-contrast shadows, dark header sections, and hero gradient backdrops.

### Secondary
- **Horizon Cyan** (`#07A5D6`): The active energetic signal. Used for primary call-to-action buttons, active navigation indicators, key highlights, progress bars, and hover state accents.
- **Cyan Dark** (`#0584ab`): Interactive hover state for cyan actions ensuring optimal contrast on white.
- **Soft Sky Tint** (`#e7f6fd`): Ambient background for badges, category chips, active tab pills, and secondary interactive areas.

### Tertiary
- **Rationalist Steel** (`#424D59`): Neutral-slate tone used for secondary supporting text, icon fills, and descriptive copy that requires medium contrast.

### Neutral
- **Page White** (`#ffffff`): The primary ground canvas for cards, articles, and main page body.
- **Soft Mist Canvas** (`#f0f7fb`): Alternating section background and modal canvas offering subtle contrast separation.
- **Main Text Charcoal** (`#2b3642`): High-legibility dark slate for standard reading paragraphs.
- **Muted Text Slate** (`#5e6b78`): Secondary metadata, publication dates, and captions.

### Named Rules
**The Civic Accent Rule.** Horizon Cyan (`#07A5D6`) is reserved for interactive signals and active navigation states. It must never coat entire informational content blocks, maintaining its power as an intentional call-to-action.

**The Contrast Floor Rule.** All text against white or light tints must meet or exceed WCAG AA 4.5:1 contrast ratio. When using white text, it must only sit on Cosmic Navy (`#023660`) or Deep Abyss (`#011f38`) surfaces.

## Typography

The typographical pairing joins **Plus Jakarta Sans** (a modern, geometric grotesk with friendly humanist terminals) for titles and display roles with **Karla** (a grotesque sans-serif renowned for editorial legibility and rhythmic reading pace) for long-form prose.

**Display Font:** `Plus Jakarta Sans`, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif  
**Body Font:** `Karla`, 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif  
**Character:** Clear, civic, modern, and open; authoritative without stiffness, approachable without triviality.

### Hierarchy
- **Display** (Bold 700, `clamp(2.4rem, 5.5vw, 4.4rem)`, line-height 1.14, letter-spacing `-0.02em`): Hero page headlines, main landing slogans.
- **Headline** (Bold 700, `clamp(1.75rem, 3.5vw, 2.5rem)`, line-height 1.25, letter-spacing `-0.015em`): Section titles, modal headers, major milestone milestones.
- **Title** (Bold 700, `1.25rem` to `1.4rem`, line-height 1.35): Card headings, article titles, accordion triggers.
- **Body** (Regular 400 & Medium 500, `1rem` to `1.1rem`, line-height 1.65 to 1.82): Articles, paragraphs, descriptive copy; optimized for 65–75 character line widths.
- **Label / Overline** (Bold 700, `0.78rem` to `0.85rem`, letter-spacing `0.08em` to `0.12em`, uppercase): Category badges, section overline tags, button labels.

### Named Rules
**The Two-Family Boundary Rule.** Plus Jakarta Sans owns headings, labels, buttons, and navigation; Karla owns continuous reading copy. Neither family borrows the other's territory.

## Layout

The layout uses a centered container model with generous vertical whitespace (`80px` to `120px` between primary sections) creating an unhurried, editorial rhythm.

- **Max Container Width:** `1240px` (`--container-width`) with `24px` gutter padding (`--container-padding`).
- **Narrow Editorial Width:** `820px` for reading article pages to maintain optimal line measure and focus.
- **Section Rhythm:** Symmetrical padding (`80px 0 100px`) framed by modern curved SVG dividers with subtle dual-stop gradients.
- **Grid Systems:**
  - Principles & Features: 2x2 responsive cards grid (`grid-template-columns: repeat(2, 1fr)` collapsing to single-column on mobile).
  - Articles & Updates: 3-column dynamic card track with pagination controls.
  - Partner Showcase: 4-column balanced card deck with identical height alignment.

## Elevation & Depth

The system uses **reactive layered depth**. Surfaces sit calm and relatively flat at rest, relying on 1px subtle borders (`rgba(2, 54, 96, 0.08)`) and soft ambient shadows. Depth is amplified purposefully during hover, selection, and modal dialog elevation.

### Shadow Vocabulary
- **Subtle Surface** (`--shadow-sm: 0 2px 8px rgba(2, 54, 96, 0.06)`): Resting state for small cards and floating indicators.
- **Resting Card** (`--shadow-card: 0 14px 34px -4px rgba(2, 54, 96, 0.07), 0 4px 12px -2px rgba(2, 54, 96, 0.03)`): Multi-stop ambient foundation for article cards and community features.
- **Elevated Hover** (`--shadow-card-hover: 0 24px 50px -8px rgba(2, 54, 96, 0.14), 0 10px 24px -4px rgba(7, 165, 214, 0.15)`): Tactual lift on interactive cards combining deep navy ambient shadow with a gentle cyan glow.
- **Header Glass Scrolled** (`0 10px 30px -10px rgba(2, 54, 96, 0.12)`): Frosted glass grounding for sticky header on scroll.

### Named Rules
**The Responsive Lift Rule.** Shadows are never purely decorative static dark blobs; they must respond to state changes (hover, focus, modal display) and pair a slight physical displacement (`transform: translateY(-2px)` to `-4px`) with shadow expansion.

## Shapes

The form language is **softly curved, tactile, and continuous**:
- **Pill Shape** (`border-radius: 9999px`): Buttons, search inputs, language switchers, category tags, and status badges. Creates a clean, approachable, modern silhouette.
- **Card Corners** (`border-radius: 14px` to `20px`): Outer container cards, article preview tiles, community photo containers.
- **Inner Elements** (`border-radius: 8px`): Sub-panels, code/document boxes, and input fields.
- **Borders:** Thin, semi-transparent hairline strokes (`1px solid rgba(2, 54, 96, 0.08)`) grounding white surfaces against the `#f0f7fb` background canvas.

## Components

### Buttons
- **Primary Action (`.btn-primary`):** Pill-shaped (`border-radius: 9999px`), background gradient `linear-gradient(135deg, #07A5D6 0%, #0584ab 100%)`, bold uppercase text, white text color, padding `12px 28px`. Includes subtle shine animation on hover and gentle lift.
- **Hero Secondary (`.btn-outline-white`):** Translucent backdrop blur pill with `1.5px solid rgba(255, 255, 255, 0.55)`, turning solid white with primary text color on hover.
- **Magnetic Link (`.btn-magnetic`):** Asymmetrical pill combining uppercase title text with an animated circular arrow badge (`38px` diameter) that scales and shifts on interaction.
- **Heart Donate Button (`.btn-donar`):** Compact pill with responsive heart icon that scales up slightly (`scale(1.2)`) on hover.

### Badges & Overline Tags
- **Section Tag (`.section-tag`):** Compact pill, uppercase label typography, background `var(--color-secondary-tint)` (`#e7f6fd`), text `var(--color-secondary)` (`#07A5D6`), border `1px solid rgba(7, 165, 214, 0.2)`.
- **Pulse Badge (`.hero__badge`):** Frosted glass pill with embedded `8px` pulsating cyan dot, advertising institutional identity and founding year.

### Cards
- **Article Card (`.article-card`):** Vertical card with `14px` radius, top media banner (`aspect-ratio: 16/9`), floating category tag over image, metadata date line, prominent title, and read article action with arrow transition.
- **Principle Card (`.principle-item`):** Hybrid horizontal/stacked card pairing full-height media preview with colored theme cards (`--sky`, `--cosmic`, `--steel`) and modal trigger button.
- **Partner Card (`.partner-card`):** Uniform height cards with white rounded container, flexbox-centered partner logo, and descriptive bilingual title underneath.

### Navigation & Header
- **Sticky Glass Navbar (`.site-header`):** Translucent white (`rgba(255, 255, 255, 0.94)`) with `blur(16px)` and subtle bottom border. Transitions smoothly to shadowed floating bar on scroll.
- **Language Switcher (`.lang-switch`):** Pill capsule with `ES / EN` toggles; active button filled with solid Cosmic Navy, inactive button in muted text with hover transition.
- **Mobile Menu Toggle (`.navbar__toggle`):** 3-bar hamburger animating to a clean 45-degree cross (`X`) when opened.

### Modales & Dialogs
- **Dialog System (`.modal`, `.principles-modal`):** Full-screen backdrop overlay (`rgba(1, 15, 28, 0.75)` with blur), centered dialog card with `20px` radius, sticky close button, and internal focus-trap accessibility.

## Do's and Don'ts

### Do:
- **Do** use `Plus Jakarta Sans` for all headings, titles, buttons, and badges, and `Karla` for continuous paragraphs and body copy.
- **Do** use pill-shaped borders (`border-radius: 9999px`) on buttons, filter chips, tags, and search bars to reinforce the approachable civic aesthetic.
- **Do** maintain the 135-degree cyan gradient (`#07A5D6` to `#0584ab`) on primary interactive actions to ensure consistent visual hierarchy.
- **Do** preserve full structural and layout parity between Spanish (`/`) and English (`/en/`) pages.
- **Do** optimize all photographic imagery in WebP format with descriptive alternative text for accessibility.

### Don't:
- **Don't** use pure solid black (`#000000`) for text or backgrounds; use `#0c1015` or Cosmic Navy `#023660` for deep tones, and `#2b3642` for body text.
- **Don't** introduce harsh, sharp-cornered rectangular buttons or heavy solid borders that break the soft, fluid agora aesthetic.
- **Don't** use decorative religious, militaristic, or esoteric symbols as design motifs; rely strictly on clean geometric, scientific, and humanistic forms.
- **Don't** use pure saturated accent colors (like raw red or yellow) outside semantic feedback states (error/warning).

