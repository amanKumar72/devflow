---
name: Bitstream Pro
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#ddb7ff'
  on-secondary: '#490080'
  secondary-container: '#6f00be'
  on-secondary-container: '#d6a9ff'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#00a572'
  on-tertiary-container: '#00311f'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#f0dbff'
  secondary-fixed-dim: '#ddb7ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6900b3'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '450'
    lineHeight: 22px
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '450'
    lineHeight: 18px
  label-xs:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 12px
  margin: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style

The design system is engineered for the modern developer: efficient, precise, and sophisticated. It strikes a balance between the hyper-utility of a terminal and the refined aesthetics of a premium productivity tool. 

The visual style is **Corporate / Modern** with a **Minimalist** foundation, borrowing the technical rigor of IDEs like VS Code and the sleek, motion-driven clarity of Raycast. It evokes a sense of "Developer Flow"—unobtrusive enough to stay out of the way, yet powerful enough to handle complex data density. Every element is designed with intent, avoiding decorative excess in favor of functional elegance and high technical readability.

## Colors

The palette is rooted in a "Deep Space" dark mode to reduce eye strain during long sessions. 

- **Primary (Electric Blue):** Used for primary actions, progress indicators, and active states. It represents the "core" of the logic.
- **Secondary (AI Purple):** Reserved strictly for intelligence-driven features, LLM responses, and automated insights.
- **Tertiary (Semantic Green):** Used for success states and "Live" status indicators.
- **Neutrals:** The background (#0D0D0D) and surface (#161616) create a subtle contrast for layered hierarchy. Borders are kept crisp and low-contrast (#2A2A2A) to maintain a seamless, integrated look.

## Typography

This design system employs a dual-typeface strategy to distinguish between user interface and technical content.

- **Inter:** Handles all UI elements, navigation, and instructional text. It is chosen for its exceptional legibility and neutral, professional tone.
- **JetBrains Mono:** Utilized for code snippets, IDs, logs, and terminal outputs. Its specific ligatures and character spacing are optimized for developer workflows.

Information hierarchy is reinforced through a strict "Label-to-Data" relationship. Labels often appear in small, uppercase Inter, while the data they represent uses JetBrains Mono to emphasize technical precision.

## Layout & Spacing

The layout is optimized for high information density, typical of professional tools. It follows a **Fluid Grid** model with strict 16px side margins on mobile.

- **Grid:** A 4-column layout for mobile, moving to an 8-column layout for tablet.
- **Density:** We prioritize "Information over White-space." Vertical spacing is tight (8px-12px) to allow more content on the fold, but horizontal padding within components remains generous (16px) to ensure touch targets are accessible.
- **Reflow:** On smaller screens, side-by-side data points reflow into vertical stacks. Technical tables switch to a card-based list view where JetBrains Mono text is given full-width priority.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Glassmorphism** rather than traditional drop shadows.

1.  **Level 0 (Base):** #0D0D0D. Used for the main app background.
2.  **Level 1 (Surface):** #161616. Used for cards and secondary navigation bars.
3.  **Level 2 (Float):** #1C1C1C with a 1px #2A2A2A border. Used for modals and pop-overs.
4.  **Glassmorphism:** Navigation bars and bottom sheets use a 20px backdrop blur with a 60% opacity fill of the surface color. This creates a sense of "layered tools" common in macOS-inspired developer interfaces. 

Shadows, if used, are extremely subtle (0px 4px 12px rgba(0,0,0,0.5)) and limited to floating action buttons or high-priority modals.

## Shapes

The shape language is "Soft-Technical." We avoid the aggressive roundness of consumer apps and the harsh sharpness of legacy terminals.

- **Cards & Inputs:** 12px corner radius (Rounded-LG) provides a modern, premium feel.
- **Buttons:** 8px corner radius (Rounded-MD) to maintain a distinct "control" look separate from content containers.
- **Chips & Tags:** 4px radius (Soft) for a more utilitarian, "tab-like" appearance.

## Components

### Buttons
- **Primary:** Electric blue background, white text, 8px radius. High-contrast.
- **Secondary:** Surface-colored background with a 1px border (#2A2A2A).
- **Ghost:** No background, blue text. Used for less frequent actions.

### Cards
- Background: #161616.
- Border: 1px solid #2A2A2A.
- Internal padding: 16px.
- Use horizontal dividers (1px solid #2A2A2A) to separate headers from content.

### Inputs & Fields
- Focused state: Border changes to Electric Blue with a subtle 2px outer glow.
- Placeholder text: JetBrains Mono, #555555.
- Error state: Border and helper text change to semantic red (#EF4444).

### Chips & Badges
- Status chips: Transparent background with a 1px border colored by status (e.g., green for 'Live', yellow for 'Pending').
- Code tags: JetBrains Mono text on a slightly lighter #222222 background.

### Lists
- Tight vertical rhythm. 
- Use monochrome icons (20px) with a subtle 10% opacity primary tint as backgrounds for the icon containers to add depth.