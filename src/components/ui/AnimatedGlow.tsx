"use client";

import { motion } from "framer-motion";

type AnimatedGlowProps = {
  className?: string;
  delay?: number;
  duration?: number;
};

export function AnimatedGlow({
  className,
  delay = 0,
  duration = 10,
}: AnimatedGlowProps) {
  return (
    <motion.div
      aria-hidden="true"
      className={className}
      initial={{ opacity: 0.4, scale: 0.92 }}
      animate={{
        opacity: [0.35, 0.7, 0.4],
        scale: [0.94, 1.08, 0.96],
        x: [0, 16, -12, 0],
        y: [0, -16, 10, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    />
  );
}
