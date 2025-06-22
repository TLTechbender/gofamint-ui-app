import { AnimationGeneratorType, Variants } from "framer-motion";

export const staggerContainer = (
  staggerChildren?: number,
  delayChildren?: number
): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: staggerChildren || 0.1,
      delayChildren: delayChildren || 0,
    },
  },
});

export const fadeIn = (
  direction: "up" | "down" | "left" | "right",
  type: AnimationGeneratorType | undefined,
  delay: number,
  duration: number
): Variants => ({
  hidden: {
    opacity: 0,
    y: direction === "up" ? 80 : direction === "down" ? -80 : 0,
    x: direction === "left" ? 80 : direction === "right" ? -80 : 0,
  },
  show: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: {
      type: type,
      delay: delay,
      duration: duration,
      ease: "easeOut",
    },
  },
});
