"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SITE_LOGO } from "@/lib/branding";
import { springBouncy, springSnappy } from "@/lib/landing-motion";

export function PageLoader() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t2 = window.setTimeout(() => setVisible(false), 1100);
    return () => window.clearTimeout(t2);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="page-loader"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-tactical grain"
          aria-busy="true"
          aria-label="Carregando"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }}
        >
          <motion.div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(201,162,39,0.12),transparent_55%)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            aria-hidden
          />
          <motion.div
            className="relative flex h-28 w-28 items-center justify-center border border-gold/80 bg-olive-deep/50 shadow-gold sm:h-32 sm:w-32"
            initial={{ scale: 0.6, rotate: -8, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={springBouncy}
          >
            <motion.div
              className="absolute inset-2"
              animate={reduce ? undefined : { scale: [1, 1.06, 1], opacity: [0.5, 0.85, 0.5] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden
            >
              <div className="h-full w-full border border-gold/25" />
            </motion.div>
            <Image src={SITE_LOGO.src} alt="" width={88} height={88} className="relative z-[1] object-contain p-2" priority />
          </motion.div>
          <motion.p
            className="mt-8 font-subtitle text-[10px] uppercase tracking-[0.45em] text-ice/70"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, ...springSnappy }}
          >
            Batalhão Paraquedista
          </motion.p>
          <motion.div
            className="mt-6 flex gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            aria-hidden
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-1 w-6 bg-gold/80"
                animate={reduce ? undefined : { scaleY: [0.35, 1.4, 0.35], opacity: [0.35, 1, 0.35] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
