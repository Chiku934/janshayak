/**
 * JAN SAHAYAK Typography System
 * Dual hierarchy: Plus Jakarta Sans for Display/Headings, Inter for Body & Tables
 */

export const typography = {
  fonts: {
    sans: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    display: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },

  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  sizes: {
    // Displays
    display2xl: {
      fontSize: '48px',
      lineHeight: '1.15',
      letterSpacing: '-0.03em',
      fontWeight: '800',
    },
    displayXl: {
      fontSize: '36px',
      lineHeight: '1.2',
      letterSpacing: '-0.025em',
      fontWeight: '800',
    },
    displayLg: {
      fontSize: '30px',
      lineHeight: '1.25',
      letterSpacing: '-0.02em',
      fontWeight: '700',
    },
    // Headings
    h1: {
      fontSize: '24px',
      lineHeight: '1.3',
      letterSpacing: '-0.02em',
      fontWeight: '700',
    },
    h2: {
      fontSize: '20px',
      lineHeight: '1.35',
      letterSpacing: '-0.015em',
      fontWeight: '700',
    },
    h3: {
      fontSize: '18px',
      lineHeight: '1.4',
      letterSpacing: '-0.01em',
      fontWeight: '600',
    },
    h4: {
      fontSize: '16px',
      lineHeight: '1.45',
      letterSpacing: '-0.005em',
      fontWeight: '600',
    },
    // Body Text
    bodyLg: {
      fontSize: '16px',
      lineHeight: '1.55',
      letterSpacing: '0',
      fontWeight: '400',
    },
    bodyMd: {
      fontSize: '14px',
      lineHeight: '1.5',
      letterSpacing: '0',
      fontWeight: '400',
    },
    bodySm: {
      fontSize: '12px',
      lineHeight: '1.45',
      letterSpacing: '0.005em',
      fontWeight: '400',
    },
    // Captions & Micro
    caption: {
      fontSize: '11px',
      lineHeight: '1.4',
      letterSpacing: '0.01em',
      fontWeight: '500',
    },
    overline: {
      fontSize: '10px',
      lineHeight: '1.3',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      fontWeight: '700',
    },
  },
} as const;
