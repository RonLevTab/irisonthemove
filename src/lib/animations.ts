import type { Variants } from "framer-motion";

export const fadeUp: Variants = {
  hidden: {
    opacity: 1,
    y: 22,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const fadeScaleIn: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

export const gentleFloat: Variants = {
  resting: {
    y: 0,
  },
  floating: {
    y: [-4, 4, -4],
    transition: {
      duration: 6,
      ease: "easeInOut",
      repeat: Number.POSITIVE_INFINITY,
    },
  },
};

export const hoverLift: Variants = {
  resting: {
    scale: 1,
    y: 0,
  },
  hover: {
    scale: 1.01,
    y: -6,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
};

export const shimmerSweep: Variants = {
  resting: {
    x: "-120%",
    opacity: 0,
  },
  hover: {
    x: "140%",
    opacity: 1,
    transition: {
      duration: 0.9,
      ease: "easeInOut",
    },
  },
};
