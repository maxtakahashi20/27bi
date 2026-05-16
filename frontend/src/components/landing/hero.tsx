"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { EnlistDialog } from "./enlist-dialog";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const [open, setOpen] = useState(false);

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden">
      <motion.div
        style={{ y }}
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551601651-bc60f254d532?q=80&w=2000')] bg-cover bg-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-900/85 via-ink-900/70 to-ink-900" />
      <div className="absolute inset-0 bg-noise opacity-40" />

      <motion.div style={{ opacity }} className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <motion.span
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-olive-400 tracking-[0.4em] text-xs md:text-sm"
        >
          EXÉRCITO BRASILEIRO — BRIGADA DE INFANTARIA PARAQUEDISTA
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.8 }}
          className="mt-6 font-display text-4xl md:text-7xl text-olive-50 text-shadow-md max-w-5xl leading-tight"
        >
          27º Batalhão de Infantaria Paraquedista
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="mt-6 max-w-2xl text-olive-200/85 text-base md:text-lg"
        >
          Forjados no ar, vitoriosos em terra. Selecionamos os melhores combatentes para missões aeroterrestres em qualquer ponto do território nacional.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
          onClick={() => setOpen(true)}
          className="mt-10 rounded border-2 border-olive-400 bg-olive-700/40 px-8 py-3 font-semibold tracking-widest text-olive-50 hover:bg-olive-600 hover:border-olive-200 transition shadow-lg shadow-black/40"
        >
          REALIZAR ALISTAMENTO
        </motion.button>
      </motion.div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-olive-200/60 text-xs tracking-[0.3em]">↓ EXPLORE</div>
      <EnlistDialog open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
