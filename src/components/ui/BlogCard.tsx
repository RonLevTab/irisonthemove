"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { hoverLift, shimmerSweep } from "@/lib/animations";

type BlogCardProps = {
  href: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  meta: string;
  tags: string[];
};

export function BlogCard({
  href,
  title,
  excerpt,
  image,
  imageAlt,
  meta,
  tags,
}: BlogCardProps) {
  return (
    <motion.article
      initial="resting"
      whileHover="hover"
      variants={hoverLift}
      className="card-shell spotlight-shell group overflow-hidden"
    >
      <Link href={href} className="block">
        <div className="relative aspect-[16/11] overflow-hidden">
          <motion.div
            className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            variants={shimmerSweep}
          />
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[rgba(31,16,16,0.35)] to-transparent" />
        </div>
        <div className="flex flex-col gap-4 p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-gold)]">
            {meta}
          </p>
          <h3 className="text-2xl font-semibold text-[var(--color-primary)]">
            {title}
          </h3>
          <p className="text-base leading-7 text-[var(--color-foreground-muted)]">
            {excerpt}
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="tag-chip">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
