export const colors = {
  light: {
    /* Core */
    background: "#fcf9f8",
    foreground: "#1c1b1b",

    /* Surface */
    surface: "#fcf9f8",
    surfaceDim: "#dcd9d9",
    surfaceBright: "#ffffff",
    surfaceContainerLowest: "#ffffff",
    surfaceContainerLow: "#f6f7fb",
    surfaceContainer: "#eef1f8",
    surfaceContainerHigh: "#e3e8f2",
    surfaceContainerHighest: "#d8deea",
    surfaceVariant: "#d8deea",
    surfaceTint: "#005ac2",

    /* Text */
    onBackground: "#1c1b1b",
    onSurface: "#1c1b1b",
    onSurfaceVariant: "#424754",
    inverseSurface: "#313030",
    inverseOnSurface: "#f3f0ef",

    /* Brand */
    primary: "#005ac2",
    onPrimary: "#ffffff",
    primaryContainer: "#d8e2ff",
    onPrimaryContainer: "#001a42",
    inversePrimary: "#adc6ff",

    secondary: "#6900b3",
    onSecondary: "#ffffff",
    secondaryContainer: "#f0dbff",
    onSecondaryContainer: "#2c0051",

    tertiary: "#005236",
    onTertiary: "#ffffff",
    tertiaryContainer: "#6ffbbe",
    onTertiaryContainer: "#002113",

    /* Fixed Color Roles */
    primaryFixed: "#d8e2ff",
    primaryFixedDim: "#adc6ff",
    onPrimaryFixed: "#001a42",
    onPrimaryFixedVariant: "#004395",
    secondaryFixed: "#f0dbff",
    secondaryFixedDim: "#ddb7ff",
    onSecondaryFixed: "#2c0051",
    onSecondaryFixedVariant: "#6900b3",
    tertiaryFixed: "#6ffbbe",
    tertiaryFixedDim: "#4edea3",
    onTertiaryFixed: "#002113",
    onTertiaryFixedVariant: "#005236",

    /* Borders */
    outline: "#74798a",
    outlineVariant: "#c2c6d6",

    /* Error */
    error: "#ba1a1a",
    onError: "#ffffff",
    errorContainer: "#ffdad6",
    onErrorContainer: "#93000a",
  },

  dark: {
    /* Core */
    background: "#131313",
    foreground: "#e5e2e1",

    /* Surface */
    surface: "#131313",
    surfaceDim: "#131313",
    surfaceBright: "#393939",
    surfaceContainerLowest: "#0e0e0e",
    surfaceContainerLow: "#1c1b1b",
    surfaceContainer: "#201f1f",
    surfaceContainerHigh: "#2a2a2a",
    surfaceContainerHighest: "#353534",
    surfaceVariant: "#353534",
    surfaceTint: "#adc6ff",

    /* Text */
    onBackground: "#e5e2e1",
    onSurface: "#e5e2e1",
    onSurfaceVariant: "#c2c6d6",
    inverseSurface: "#e5e2e1",
    inverseOnSurface: "#313030",

    /* Brand */
    primary: "#adc6ff",
    onPrimary: "#002e6a",
    primaryContainer: "#4d8eff",
    onPrimaryContainer: "#00285d",
    inversePrimary: "#005ac2",

    secondary: "#ddb7ff",
    onSecondary: "#490080",
    secondaryContainer: "#6f00be",
    onSecondaryContainer: "#d6a9ff",

    tertiary: "#4edea3",
    onTertiary: "#003824",
    tertiaryContainer: "#00a572",
    onTertiaryContainer: "#00311f",

    /* Fixed Color Roles */
    primaryFixed: "#d8e2ff",
    primaryFixedDim: "#adc6ff",
    onPrimaryFixed: "#001a42",
    onPrimaryFixedVariant: "#004395",
    secondaryFixed: "#f0dbff",
    secondaryFixedDim: "#ddb7ff",
    onSecondaryFixed: "#2c0051",
    onSecondaryFixedVariant: "#6900b3",
    tertiaryFixed: "#6ffbbe",
    tertiaryFixedDim: "#4edea3",
    onTertiaryFixed: "#002113",
    onTertiaryFixedVariant: "#005236",

    /* Borders */
    outline: "#8c909f",
    outlineVariant: "#424754",

    /* Error */
    error: "#ffb4ab",
    onError: "#690005",
    errorContainer: "#93000a",
    onErrorContainer: "#ffdad6",
  },
} as const;

export const typography = {
  headlineLg: {
    fontFamily: "Inter",
    fontSize: 28,
    fontWeight: "600",
    lineHeight: 34,
    letterSpacing: -0.02,
  },
  headlineMd: {
    fontFamily: "Inter",
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 28,
    letterSpacing: -0.01,
  },
  bodyMd: {
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  bodySm: {
    fontFamily: "Inter",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
  codeMd: {
    fontFamily: "JetBrains Mono",
    fontSize: 14,
    fontWeight: "450",
    lineHeight: 22,
  },
  codeSm: {
    fontFamily: "JetBrains Mono",
    fontSize: 12,
    fontWeight: "450",
    lineHeight: 18,
  },
  labelXs: {
    fontFamily: "Inter",
    fontSize: 11,
    fontWeight: "600",
    lineHeight: 16,
    letterSpacing: 0.05,
  },
} as const;

export const radius = {
  sm: 4,
  default: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const spacing = {
  unit: 4,
  gutter: 12,
  margin: 16,
  stackSm: 8,
  stackMd: 16,
  stackLg: 24,
} as const;
