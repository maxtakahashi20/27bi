"use client";

import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { springSnappy } from "@/lib/landing-motion";

type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  title: string;
  category: "operacoes" | "treinamento" | "historico";
};

const images: GalleryItem[] = [
  {
    id: "g1",
    src: "/landing/hero-background.webp",
    alt: "Operações e ambiente tático",
    title: "Prontidão operacional",
    category: "operacoes",
  },
  {
    id: "g2",
    src: "/landing/batalhao-precursores.jpg",
    alt: "Batalhão de precursores em formação",
    title: "Precursores",
    category: "historico",
  },
  {
    id: "g3",
    src: "/landing/tropas-em-campo.jpg",
    alt: "Tropas em ambiente de campo",
    title: "Em campo",
    category: "treinamento",
  },
  {
    id: "g4",
    src: "/landing/tropas-em-campo.jpg",
    alt: "Instrução e coesão de grupo",
    title: "Instrução coletiva",
    category: "treinamento",
  },
  {
    id: "g5",
    src: "/landing/batalhao-precursores.jpg",
    alt: "Tradição e história da unidade",
    title: "Tradição de arma",
    category: "historico",
  },
  {
    id: "g6",
    src: "/landing/hero-background.webp",
    alt: "Missão e emprego da força",
    title: "Emprego tático",
    category: "operacoes",
  },
];

const filters: { id: "todas" | GalleryItem["category"]; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "operacoes", label: "Operações" },
  { id: "treinamento", label: "Treinamento" },
  { id: "historico", label: "Histórico" },
];

const spans = [
  "md:col-span-2 md:row-span-2",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-2 md:row-span-2",
  "md:col-span-2",
  "md:col-span-2",
];

export function Gallery() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<GalleryItem | null>(null);
  const [cat, setCat] = useState<(typeof filters)[number]["id"]>("todas");

  const filtered = useMemo(
    () => (cat === "todas" ? images : images.filter((i) => i.category === cat)),
    [cat],
  );

  return (
    <section id="galeria" className="border-t border-gold/20 bg-ink-800 py-24 sm:py-28 grain">
      <div className="relative z-[1] mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <motion.div
          className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={reduce ? { duration: 0 } : springSnappy}
        >
          <div>
            <motion.span
              className="font-subtitle text-[10px] uppercase tracking-[0.45em] text-gold"
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05, ...springSnappy }}
            >
              Registros
            </motion.span>
            <motion.h2
              className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-ice md:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, ...springSnappy }}
            >
              Galeria operacional
            </motion.h2>
            <motion.div
              className="mt-4 h-px w-20 bg-gold"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: reduce ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "left" }}
            />
          </div>
          <LayoutGroup id="gallery-filters">
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filtrar galeria">
              {filters.map((f) => (
                <motion.button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={cat === f.id}
                  layout
                  onClick={() => setCat(f.id)}
                  whileHover={reduce ? undefined : { y: -2 }}
                  whileTap={reduce ? undefined : { scale: 0.96 }}
                  transition={springSnappy}
                  className={cn(
                    "border px-4 py-2 font-subtitle text-[10px] uppercase tracking-[0.22em] transition-colors duration-tactical focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                    cat === f.id
                      ? "border-gold bg-gold text-tactical shadow-[0_0_20px_rgba(201,162,39,0.25)]"
                      : "border-gold/35 bg-transparent text-ice/85 hover:border-gold hover:text-gold",
                  )}
                >
                  {f.label}
                </motion.button>
              ))}
            </div>
          </LayoutGroup>
        </motion.div>

        <LayoutGroup id="gallery-grid">
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:auto-rows-[minmax(140px,1fr)] md:grid-cols-4">
            <AnimatePresence initial={false} mode="popLayout">
              {filtered.map((item, i) => (
                <motion.button
                  key={item.id}
                  type="button"
                  layout
                  initial={{ opacity: 0, scale: 0.94, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.22 } }}
                  transition={reduce ? { duration: 0 } : { ...springSnappy, delay: i * 0.04 }}
                  whileHover={reduce ? undefined : { scale: 1.02, zIndex: 2 }}
                  whileTap={reduce ? undefined : { scale: 0.98 }}
                  onClick={() => setActive(item)}
                  className={cn(
                    "group relative min-h-[120px] overflow-hidden border border-gold/25 bg-tactical sm:min-h-[140px]",
                    spans[i % spans.length],
                  )}
                >
                  <motion.div className="absolute inset-0" whileHover={reduce ? undefined : { scale: 1.06 }} transition={{ duration: 0.45 }}>
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 50vw, 25vw"
                      loading="lazy"
                    />
                  </motion.div>
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-tactical via-tactical/40 to-transparent opacity-90 transition duration-tactical group-hover:from-tactical group-hover:via-tactical/70"
                    aria-hidden
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4">
                    <span className="font-subtitle text-[9px] uppercase tracking-[0.2em] text-gold/80">
                      {filters.find((x) => x.id === item.category)?.label}
                    </span>
                    <span className="mt-1 font-display text-lg uppercase tracking-[0.12em] text-ice opacity-95 transition group-hover:text-gold sm:text-xl">
                      {item.title}
                    </span>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </LayoutGroup>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            key="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Imagem ampliada"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setActive(null)}
            onKeyDown={(e) => e.key === "Escape" && setActive(null)}
            className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/92 p-6"
          >
            <motion.img
              src={active.src}
              alt={active.alt}
              initial={{ scale: 0.88, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 12 }}
              transition={springSnappy}
              className="max-h-[88vh] max-w-full object-contain shadow-tactical"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
