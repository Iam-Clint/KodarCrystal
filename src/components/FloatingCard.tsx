import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  rotate?: number;
}

export function FloatingCard({ children, className = "", delay = 0, rotate = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: rotate - 4 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, rotate: rotate / 2, transition: { duration: 0.3 } }}
      className={`glass-strong gradient-border rounded-2xl p-3 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)] ${className}`}
      style={{ animation: `float ${6 + delay * 2}s ease-in-out infinite`, animationDelay: `${delay}s` }}
    >
      {children}
    </motion.div>
  );
}
