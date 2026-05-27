---
name: Tactile Precision
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#5a4136'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#8e7164'
  outline-variant: '#e3bfb1'
  surface-tint: '#a23f00'
  primary: '#a23f00'
  on-primary: '#ffffff'
  primary-container: '#ff6700'
  on-primary-container: '#561e00'
  inverse-primary: '#ffb595'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfde'
  on-secondary-container: '#636262'
  tertiary: '#0061a2'
  on-tertiary: '#ffffff'
  tertiary-container: '#019cff'
  on-tertiary-container: '#003156'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcd'
  primary-fixed-dim: '#ffb595'
  on-primary-fixed: '#351000'
  on-primary-fixed-variant: '#7c2e00'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#d1e4ff'
  tertiary-fixed-dim: '#9dcaff'
  on-tertiary-fixed: '#001d35'
  on-tertiary-fixed-variant: '#00497c'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
  surface-white: '#FFFFFF'
  border-subtle: '#E0E0E0'
  text-muted: '#757575'
  success-green: '#28A745'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  section-padding: 80px
---

## Brand & Style

The design system is engineered for a premium mechanical keyboard e-commerce experience, merging the utilitarian world of hardware enthusiasts with a high-end consumer electronics aesthetic. It draws inspiration from the "Engineered Simplicity" of modern tech leaders, emphasizing clarity, structural integrity, and the tactile nature of the product.

The design style is **Minimalist with Corporate Modern influences**. It prioritizes high-quality product photography by providing a quiet, structured environment of clean whites and subtle grays. The UI stays out of the way to let the textures and colors of keycaps and switches stand out, using bold orange accents only to guide functional momentum and conversion.

## Colors

The palette is rooted in a "Studio White" philosophy. The primary background should always be `#FFFFFF` to ensure product renders look seamless.

- **Primary (`#FF6700`)**: Reserved strictly for primary call-to-actions, price highlights, and active states. This color represents energy and precision.
- **Secondary (`#191919`)**: Used for primary headlines and heavy navigational elements to provide a "weighted" feel similar to premium hardware.
- **Neutral (`#F7F7F7`)**: Used for section backgrounds to create a subtle distinction between the main content and secondary information blocks.
- **Surface & Border**: Use `#E0E0E0` for dividers and borders to maintain a structure that feels architectural rather than decorative.

## Typography

This design system utilizes **Inter** across all levels to maintain a systematic, "tech-spec" appearance. The typeface was chosen for its exceptional legibility in technical descriptions and its neutral, modern tone.

- **Scale**: Use tight tracking (letter spacing) for larger display headers to give a "locked-in" professional look. 
- **Hierarchy**: Headlines should almost exclusively use the Secondary color (`#191919`), while body text can shift to `text-muted` for descriptions to maintain visual breathing room.
- **Technical Data**: When displaying switch specs (actuation force, travel distance), use `label-bold` to denote keys and `body-md` for values to create a clear data-grid feel.

## Layout & Spacing

The layout follows a **Fixed Grid** approach for desktop to mirror the intentional, finite boundaries of a keyboard frame.

- **Grid**: A 12-column grid with 24px gutters. Product cards typically span 3 columns (4 per row) or 4 columns (3 per row) depending on the detail required.
- **Rhythm**: All spacing is derived from an 8px base unit. 
- **Padding**: Use generous vertical section padding (80px+) to allow the high-quality product photography to "breathe" and feel like a gallery exhibition.
- **Mobile**: Transitions to a single-column fluid layout with 16px side margins. Horizontal swiping carousels are preferred for related products to keep the page length manageable.

## Elevation & Depth

To maintain a clean and modern tech aesthetic, the design system avoids heavy shadows in favor of **Tonal Layers** and **Ambient Depth**.

- **Surfaces**: Use a two-tier elevation model. The base is White (`#FFFFFF`). Interactive elements (cards) sit on this base with a very soft, diffused shadow (0px 4px 20px rgba(0,0,0,0.05)).
- **Interactivity**: Upon hover, a card's shadow should slightly intensify (rgba(0,0,0,0.12)) and the element should lift by 2px to provide tactile feedback similar to a keypress.
- **Overlays**: Modals and dropdowns use a crisp 1px border (`#E0E0E0`) combined with a medium-diffusion shadow to ensure they feel like separate physical layers without looking "muddy."

## Shapes

The shape language is **Rounded**, reflecting the comfortable, ergonomic curves of high-end keycaps (like the Cherry or OSA profiles).

- **Base Radius**: 0.5rem (8px) is the standard for product cards and input fields.
- **Button Radius**: Buttons use the same 8px radius to feel consistent with the hardware.
- **Large Elements**: Banners and hero containers may use `rounded-xl` (1.5rem) to soften the overall technical feel of the site, making it more approachable to hobbyists.

## Components

### Buttons
- **Primary**: Solid Orange (`#FF6700`) with White text. Bold weight. No gradients.
- **Secondary**: Ghost style with a 1px border of `#191919`.
- **Tertiary**: Text-only with an icon, used for "Learn More" or "View Specs."

### Product Cards
- Cards must have a white background and a subtle 1px border. 
- Images should be centered with at least 24px of internal padding to prevent the product from touching the borders.
- Prices should be highlighted in Primary Orange or Bold Secondary Black.

### Input Fields & Controls
- **Form Fields**: 8px radius, white background, `#E0E0E0` border. On focus, the border changes to Primary Orange.
- **Chips/Tags**: Used for "In Stock," "Hot Swap," or "Wireless." These use a light gray fill (`#F7F7F7`) and small `label-sm` typography.

### Navigation
- A minimalist top bar with high transparency or solid white. 
- Use simple text links with an orange underline on hover to indicate the active path.

### Technical Spec Tables
- Clean, alternating row colors (White and `#F7F7F7`) with no vertical lines. This keeps the technical data organized but visually light.