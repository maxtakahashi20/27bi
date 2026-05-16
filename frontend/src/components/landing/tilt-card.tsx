"use client";

import { type ReactNode, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** Intensidade do tilt em graus (desktop / pointer fino). */
  tilt?: number;
};

/**
 * Cartão com perspectiva 3D leve ao mover o mouse.
 * Desliga automaticamente com prefers-reduced-motion.
 */
export function TiltCard({ children, className = "", tilt = 10 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const springRx = useSpring(rx, { stiffness: 260, damping: 28 });
  const springRy = useSpring(ry, { stiffness: 260, damping: 28 });

  const onMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * tilt * 2);
    rx.set(-py * tilt * 2);
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        transformPerspective: 960,
        rotateX: reduce ? 0 : springRx,
        rotateY: reduce ? 0 : springRy,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}
