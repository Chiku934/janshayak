/**
 * JAN SAHAYAK — Civic Design System Color Tokens
 * Light-theme only, enterprise civic grade, high contrast WCAG AAA / AA compliant.
 */

export const colors = {
  // Brand / Civic Identity
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb', // Primary action standard
    700: '#1d4ed8', // Darker interactive hover
    800: '#1e40af',
    900: '#1e3a8a', // Deep Ashoka / Gov Navy
    950: '#172554',
  },

  // Saffron National Accent (Public Service & Urgency Highlight)
  saffron: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },

  // Emerald Civic Green (Resolution, DigiLocker Trust, Verified States)
  emerald: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // Soft Purple Secondary (Administrative Authority & AI Triage)
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },

  // Neutral Slate Palette (High readability, navy-leaning text)
  neutral: {
    50: '#f8fafc',  // App Background
    100: '#f1f5f9', // Card sub-sections & hover
    200: '#e2e8f0', // Standard borders
    300: '#cbd5e1', // Strong borders / icons
    400: '#94a3b8', // Placeholder & secondary icons
    500: '#64748b', // Secondary body & captions
    600: '#475569', // Body text
    700: '#334155', // Subheadings
    800: '#1e293b', // Headings
    900: '#0f172a', // High-contrast title navy
    950: '#020617',
  },

  // Feedback & Status Semantics
  feedback: {
    success: {
      bg: '#f0fdf4',
      border: '#bbf7d0',
      text: '#166534',
      icon: '#16a34a',
    },
    warning: {
      bg: '#fffbeb',
      border: '#fde68a',
      text: '#92400e',
      icon: '#d97706',
    },
    error: {
      bg: '#fef2f2',
      border: '#fecaca',
      text: '#991b1b',
      icon: '#dc2626',
    },
    info: {
      bg: '#eff6ff',
      border: '#bfdbfe',
      text: '#1e40af',
      icon: '#2563eb',
    },
  },
} as const;
