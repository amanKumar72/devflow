# Savor Design System

## Theme Modes

The design system supports both **Light** and **Dark** themes while preserving the same premium food-delivery identity, typography, spacing rhythm, and component structure.

---

# Tokens

## Colors

```yaml
colors:
  light:
    surface: '#131313'
    surface-dim: '#131313'
    surface-bright: '#3a3939'
    surface-container-lowest: '#0e0e0e'
    surface-container-low: '#1c1b1b'
    surface-container: '#201f1f'
    surface-container-high: '#2a2a2a'
    surface-container-highest: '#353534'
    on-surface: '#e5e2e1'
    on-surface-variant: '#e2bfb0'
    inverse-surface: '#e5e2e1'
    inverse-on-surface: '#313030'
    outline: '#a98a7d'
    outline-variant: '#5a4136'
    surface-tint: '#ffb693'
    primary: '#ffb693'
    on-primary: '#561f00'
    primary-container: '#ff6b00'
    on-primary-container: '#572000'
    inverse-primary: '#a04100'
    secondary: '#c8c6c5'
    on-secondary: '#303030'
    secondary-container: '#474746'
    on-secondary-container: '#b7b5b4'
    tertiary: '#ffba20'
    on-tertiary: '#412d00'
    tertiary-container: '#c78f00'
    on-tertiary-container: '#422d00'
    error: '#ffb4ab'
    on-error: '#690005'
    error-container: '#93000a'
    on-error-container: '#ffdad6'
    primary-fixed: '#ffdbcc'
    primary-fixed-dim: '#ffb693'
    on-primary-fixed: '#351000'
    on-primary-fixed-variant: '#7a3000'
    secondary-fixed: '#e4e2e1'
    secondary-fixed-dim: '#c8c6c5'
    on-secondary-fixed: '#1b1c1c'
    on-secondary-fixed-variant: '#474746'
    tertiary-fixed: '#ffdea8'
    tertiary-fixed-dim: '#ffba20'
    on-tertiary-fixed: '#271900'
    on-tertiary-fixed-variant: '#5e4200'
    background: '#131313'
    on-background: '#e5e2e1'
    surface-variant: '#353534'

  dark:
    surface: '#fcf9f8'
    surface-dim: '#dcd9d9'
    surface-bright: '#fcf9f8'
    surface-container-lowest: '#ffffff'
    surface-container-low: '#f6f3f2'
    surface-container: '#f0edec'
    surface-container-high: '#ebe7e7'
    surface-container-highest: '#e5e2e1'
    on-surface: '#1c1b1b'
    on-surface-variant: '#5a4136'
    inverse-surface: '#313030'
    inverse-on-surface: '#f3f0ef'
    outline: '#8e7164'
    outline-variant: '#e2bfb0'
    surface-tint: '#a04100'
    primary: '#a04100'
    on-primary: '#ffffff'
    primary-container: '#ff6b00'
    on-primary-container: '#572000'
    inverse-primary: '#ffb693'
    secondary: '#5f5e5e'
    on-secondary: '#ffffff'
    secondary-container: '#e4e2e1'
    on-secondary-container: '#656464'
    tertiary: '#7c5800'
    on-tertiary: '#ffffff'
    tertiary-container: '#c78f00'
    on-tertiary-container: '#422d00'
    error: '#ba1a1a'
    on-error: '#ffffff'
    error-container: '#ffdad6'
    on-error-container: '#93000a'
    primary-fixed: '#ffdbcc'
    primary-fixed-dim: '#ffb693'
    on-primary-fixed: '#351000'
    on-primary-fixed-variant: '#7a3000'
    secondary-fixed: '#e4e2e1'
    secondary-fixed-dim: '#c8c6c5'
    on-secondary-fixed: '#1b1c1c'
    on-secondary-fixed-variant: '#474746'
    tertiary-fixed: '#ffdea8'
    tertiary-fixed-dim: '#ffba20'
    on-tertiary-fixed: '#271900'
    on-tertiary-fixed-variant: '#5e4200'
    background: '#fcf9f8'
    on-background: '#1c1b1b'
    surface-variant: '#e5e2e1'
```

---

## Typography

```yaml
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em

  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em

  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px

  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px

  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px

  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px

  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em

  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
```

---

## Radius

```yaml
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
```

---

## Spacing

```yaml
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 120px
```

---

# Brand & Style

The design system is crafted for a premium, high-end food delivery experience that prioritizes visual indulgence and effortless navigation.

It targets an urban, tech-savvy audience that appreciates culinary artistry as much as convenience.

The visual language combines:

* **Minimalism**
* **Glassmorphism**
* **Hyper-rounded layouts**
* **High-quality imagery**
* **Soft depth & tonal layering**

---

# Light Theme Philosophy

The light theme uses a luminous white foundation that feels airy, elegant, and fresh.

### Characteristics

* Crisp white backgrounds
* Soft neutral surfaces
* Warm orange highlights
* Gentle shadows
* Clean editorial feel

### Emotional Drivers

* Freshness
* Cleanliness
* Simplicity
* Premium hospitality

---

# Dark Theme Philosophy

The dark theme uses cinematic blacks and rich charcoal tones to create a luxurious and immersive browsing experience.

### Characteristics

* OLED-friendly dark backgrounds
* Tonal layering instead of heavy shadows
* Neon-like orange accents
* Glassmorphic overlays
* Rich visual contrast

### Emotional Drivers

* Luxury
* Focus
* Depth
* Exclusivity

---

# Elevation & Depth

## Light Theme

* Use soft shadows
* Very subtle borders
* Bright translucent glass effects
* Warm ambient CTA glow

```css
box-shadow: 0 4px 12px rgba(0,0,0,0.05);
backdrop-filter: blur(24px);
```

## Dark Theme

* Use tonal surface layering
* Avoid heavy shadows
* Use glowing accents carefully
* Maintain separation using opacity

```css
box-shadow: 0 0 30px rgba(255,107,0,0.2);
backdrop-filter: blur(24px);
```

---

# Components

## Primary Button

### Shared

* Height: 56px
* Pill radius
* Bold typography

### Colors

| Theme | Background | Text    |
| ----- | ---------- | ------- |
| Light | #FF6B00    | #FFFFFF |
| Dark  | #FF6B00    | #FFFFFF |

---

## Search Bar

### Shared

* Fully rounded
* Left icon
* Large touch target

### Light

* Background: #F5F5F5
* Icon: #757575

### Dark

* Background: #1A1A1A
* Icon: #A0A0A0

---

## Category Chips

### Light

* Default: #F5F5F5
* Border: #EEEEEE
* Text: #252525

### Dark

* Default: #1A1A1A
* Border: #252525
* Text: #A0A0A0

### Selected

* Background: #FF6B00
* Text: #FFFFFF

---

## Food Cards

### Shared

* 24px radius
* Large imagery
* Spacious padding
* Elevated presentation

### Light

* Soft shadow
* White background

### Dark

* Subtle border
* Tonal dark layering

---

## Navigation Bars

### Shared

* Fixed positioning
* Glassmorphism
* Background blur
* Active orange icons

### Light

```css
background: rgba(255,255,255,0.8);
border: 1px solid rgba(0,0,0,0.03);
```

### Dark

```css
background: rgba(0,0,0,0.5);
border: 1px solid rgba(255,255,255,0.06);
```

---

# Design Principles

1. Prioritize imagery
2. Maintain generous spacing
3. Keep typography highly legible
4. Use orange sparingly for emphasis
5. Avoid visual clutter
6. Preserve tactile rounded shapes
7. Use motion subtly and purposefully

---

# Accessibility

* Maintain WCAG contrast ratios
* Minimum 44px touch targets
* Avoid overusing transparency
* Ensure readable text on imagery
* Use motion with reduced-motion fallbacks

---

# Suggested Theme Switching Strategy

```js
const theme = {
  light,
  dark,
};

const currentTheme = isDark ? theme.dark : theme.light;
```

---

# Suggested CSS Variable Structure

```css
:root[data-theme='light'] {
  --background: #fcf9f8;
  --text: #1c1b1b;
  --primary: #ff6b00;
}

:root[data-theme='dark'] {
  --background: #131313;
  --text: #e5e2e1;
  --primary: #ff6b00;
}
```
