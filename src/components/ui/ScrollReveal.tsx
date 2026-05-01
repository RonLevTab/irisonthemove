"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { fadeUp } from "@/lib/animations";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  once?: boolean;
};

export function ScrollReveal({
  children,
  className,
  once = true,
}: ScrollRevealProps) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
