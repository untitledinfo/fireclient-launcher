"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin red progress bar pinned under the header. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 30, mass: 0.3 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed left-0 right-0 top-16 z-40 h-[2px] origin-left bg-gradient-to-r from-fire/40 via-fire to-ember md:top-[4.5rem]"
    />
  );
}
