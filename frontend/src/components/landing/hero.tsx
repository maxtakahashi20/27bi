"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { EnlistDialog } from "./enlist-dialog";

const HERO_IMG =
  "https://images.unsplash.com/photo-1569242840510-c8b56c198c89?q=80&w=2000&auto=format&fit=crop";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const [open, setOpen] = useState(false);

  return (
    <section ref={ref} className="relative min-h-[100dvh] w-full overflow-hidden grain">
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src={HERO_IMG}
          alt="Paraquedistas em operação aeroterrestre — imagem ilustrativa"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </motion.div>

      <div className="absolute inset-0 bg-hero-olive" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-t from-tactical via-transparent to-tactical/40" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-[length:48px_48px] opacity-30" aria-hidden />

      <motion.div
        style={{ opacity }}
        className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-4 pb-28 pt-24 text-center sm:px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.55 }}
          className="mb-8 flex flex-col items-center"
        >
          <div
            className="flex h-24 w-24 items-center justify-center border-2 border-gold bg-tactical/50 shadow-gold sm:h-28 sm:w-28"
            aria-hidden
          >
            <svg viewBox="0 0 100 100" className="h-[4.5rem] w-[4.5rem] text-gold sm:h-20 sm:w-20">
              <path
                fill="currentColor"
                fillOpacity="0.12"
                stroke="currentColor"
                strokeWidth="1.8"
                d="M50 8 L88 28 L88 72 L50 92 L12 72 L12 28 Z"
              />
              <text
                x="50"
                y="58"
                textAnchor="middle"
                className="fill-ice font-display text-[26px]"
                style={{ fontFamily: "var(--font-bebas), sans-serif" }}
              >
                27
              </text>
            </svg>
          </div>
          <span className="mt-4 font-subtitle text-[10px] uppercase tracking-[0.5em] text-gold/90">
            Exército Brasileiro — Brigada de Infantaria Paraquedista
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduce ? 0 : 0.15, duration: reduce ? 0 : 0.75 }}
          className="max-w-5xl font-display text-4xl uppercase leading-[1.05] tracking-[0.06em] text-ice text-shadow-tactical sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
        >
          27º Batalhão de Infantaria Paraquedista
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduce ? 0 : 0.35, duration: reduce ? 0 : 0.65 }}
          className="mt-6 max-w-2xl font-subtitle text-sm font-medium uppercase leading-relaxed tracking-[0.18em] text-ice/85 md:text-base"
        >
          Força, precisão e honra — forjados no ar, vitoriosos em terra.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0 : 0.5, duration: reduce ? 0 : 0.6 }}
          className="mt-5 max-w-xl font-body text-sm leading-relaxed text-ice/80 md:text-base"
        >
          Selecionamos os melhores combatentes para missões aeroterrestres em qualquer ponto do território nacional.
        </motion.p>

        <motion.button
          type="button"
          id="alistar"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduce ? 0 : 0.68, duration: reduce ? 0 : 0.55 }}
          onClick={() => setOpen(true)}
          className="mt-12 border-2 border-gold bg-transparent px-10 py-3 font-subtitle text-xs uppercase tracking-[0.35em] text-gold transition duration-tactical hover:bg-gold hover:text-tactical focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-olive-deep"
        >
          Realizar alistamento
        </motion.button>
      </motion.div>

      <div
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-gold/70"
        aria-hidden
      >
        <span className="font-subtitle text-[9px] uppercase tracking-[0.45em]">Role</span>
        <span className="h-8 w-px bg-gradient-to-b from-gold to-transparent motion-safe:animate-scroll-hint" />
      </div>

      <EnlistDialog open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
