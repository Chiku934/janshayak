/**
 * JAN SAHAYAK Elevation & Shadows
 * Subtle, non-flashy, crisp light-mode shadows with soft blue-navy tint.
 */

export const shadows = {
  none: 'none',
  '2xs': '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
  xs: '0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
  sm: '0 2px 4px -1px rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
  md: '0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)',
  lg: '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)',
  xl: '0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
  '2xl': '0 25px 50px -12px rgba(15, 23, 42, 0.15)',
  
  // Accessible focus rings
  focus: {
    primary: '0 0 0 3px rgba(37, 99, 235, 0.25)',
    error: '0 0 0 3px rgba(220, 38, 38, 0.25)',
    success: '0 0 0 3px rgba(22, 163, 74, 0.25)',
  },
} as const;
