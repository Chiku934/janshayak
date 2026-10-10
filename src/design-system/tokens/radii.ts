/**
 * JAN SAHAYAK Border Radius System
 * Clean, soft rounded corners matching modern enterprise civic portals.
 */

export const radii = {
  none: '0px',
  xs: '4px',
  sm: '6px',
  md: '8px',   // Standard buttons & input fields
  lg: '12px',  // Standard cards & dropdown panels
  xl: '16px',  // Modals, hero containers, drawers
  '2xl': '24px', // Floating banners & dialog surfaces
  '3xl': '32px', // Mobile device frames
  full: '9999px', // Badges, pill tags, round icon buttons
} as const;
