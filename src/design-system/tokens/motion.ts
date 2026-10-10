import { Variants, Transition } from 'framer-motion';

/**
 * JAN SAHAYAK Motion & Animation Tokens
 * Subtle, professional, enterprise-grade easing without excessive bouncing.
 */

export const transitions: Record<string, Transition> = {
  fast: { duration: 0.15, ease: [0.16, 1, 0.3, 1] },
  standard: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  smooth: { duration: 0.35, ease: [0.25, 1, 0.5, 1] },
  gentle: { duration: 0.5, ease: [0.25, 1, 0.5, 1] },
};

// 1. Page Fade & Slide Transition
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: transitions.standard,
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: transitions.fast,
  },
};

// 2. Card Entrance
export const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.standard,
  },
};

// 3. Modal Entrance (Scale + Fade)
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: transitions.standard,
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 6,
    transition: transitions.fast,
  },
};

// 4. Modal Backdrop
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitions.fast },
  exit: { opacity: 0, transition: transitions.fast },
};

// 5. Drawer Slide-in
export const drawerVariants: Variants = {
  hiddenRight: { x: '100%', opacity: 0.8 },
  visibleRight: { x: 0, opacity: 1, transition: transitions.smooth },
  exitRight: { x: '100%', opacity: 0.8, transition: transitions.fast },
  
  hiddenBottom: { y: '100%', opacity: 0.8 },
  visibleBottom: { y: 0, opacity: 1, transition: transitions.smooth },
  exitBottom: { y: '100%', opacity: 0.8, transition: transitions.fast },
};

// 6. List Stagger Container & Item
export const listContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

export const listItemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.standard,
  },
};

// 7. Button Micro-Interactions
export const buttonTapMotion = {
  scale: 0.98,
  transition: transitions.fast,
};

export const buttonHoverMotion = {
  y: -1,
  transition: transitions.fast,
};

// 8. Progress Transition
export const progressTransition: Transition = {
  duration: 0.45,
  ease: [0.16, 1, 0.3, 1],
};
