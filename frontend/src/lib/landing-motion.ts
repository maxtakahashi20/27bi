import type { Transition, Variants } from "framer-motion";

/** Springs — respeite `useReducedMotion()` nos componentes (duração 0 / sem loop). */
export const springSnappy: Transition = { type: "spring", stiffness: 420, damping: 32, mass: 0.85 };
export const springSoft: Transition = { type: "spring", stiffness: 140, damping: 22 };
export const springBouncy: Transition = { type: "spring", stiffness: 280, damping: 18 };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: springSoft },
};

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: springSnappy },
};
