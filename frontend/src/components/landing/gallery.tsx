"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type GalleryItem = {
  src: string;
  alt: string;
  title: string;
  category: "operacoes" | "treinamento" | "historico";
};

const images: GalleryItem[] = [
  {
    src: "https://images.unsplash.com/photo-1569242840510-c8b56c198c89?w=1200&q=80&auto=format&fit=crop",
    alt: "Operação aeroterrestre — treinamento com aeronave",
    title: "Embarque tático",
    category: "operacoes",
  },
  {
    src: "https://images.unsplash.com/photo-1579912437766-7896df6d3cd6?w=1200&q=80&auto=format&fit=crop",
    alt: "Equipamento e preparação de campo",
    title: "Prontidão de campo",
    category: "treinamento",
  },
  {
    src: "https://images.unsplash.com/photo-1591729803664-7c1d2a905a82?w=1200&q=80&auto=format&fit=crop",
    alt: "Ambiente de instrução militar",
    title: "Instrução coletiva",
    category: "treinamento",
  },
  {
    src: "https://images.unsplash.com/photo-1517502166878-35c93a0072f0?w=1200&q=80&auto=format&fit=crop",
    alt: "Cenário de patrulha e terreno acidentado",
    title: "Patrulha em terreno",
    category: "operacoes",
  },
  {
    src: "https://images.unsplash.com/photo-1517747614396-d21a78b850e8?w=1200&q=80&auto=format&fit=crop",
    alt: "Memória institucional e tradição",
    title: "Tradição de arma",
    category: "historico",
  },
  {
    src: "https://images.unsplash.com/photo-1599839619722-39751411ea63?w=1200&q=80&auto=format&fit=crop",
    alt: "Treinamento físico e resistência",
    title: "Condicionamento",
    category: "treinamento",
  },
];

const filters: { id: "todas" | GalleryItem["category"]; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "operacoes", label: "Operações" },
  { id: "treinamento", label: "Treinamento" },
  { id: "historico", label: "Histórico" },
];

/** Layout pattern: asymmetric spans for visual rhythm */
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
  const [active, setActive] = useState<string | null>(null);
  const [cat, setCat] = useState<(typeof filters)[number]["id"]>("todas");

  const filtered = useMemo(
    () => (cat === "todas" ? images : images.filter((i) => i.category === cat)),
    [cat],
  );

  return (
    <section id="galeria" className="border-t border-gold/20 bg-ink-800 py-24 sm:py-28 grain">
      <div className="relative z-[1] mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="font-subtitle text-[10px] uppercase tracking-[0.45em] text-gold">Registros</span>
            <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-ice md:text-5xl lg:text-6xl">
              Galeria operacional
            </h2>
            <div className="mt-4 h-px w-20 bg-gold" />
          </div>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filtrar galeria">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={cat === f.id}
                onClick={() => setCat(f.id)}
                className={cn(
                  "border px-4 py-2 font-subtitle text-[10px] uppercase tracking-[0.22em] transition duration-tactical focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                  cat === f.id
                    ? "border-gold bg-gold text-tactical"
                    : "border-gold/35 bg-transparent text-ice/85 hover:border-gold hover:text-gold",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:auto-rows-[minmax(140px,1fr)] md:grid-cols-4">
          {filtered.map((item, i) => (
            <motion.button
              key={item.src + cat}
              type="button"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: reduce ? 0 : i * 0.04, duration: reduce ? 0 : 0.4 }}
              onClick={() => setActive(item.src)}
              className={cn(
                "group relative min-h-[120px] overflow-hidden border border-gold/25 bg-tactical sm:min-h-[140px]",
                spans[i % spans.length],
              )}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
                loading="lazy"
              />
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
        </div>
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Imagem ampliada"
          onClick={() => setActive(null)}
          onKeyDown={(e) => e.key === "Escape" && setActive(null)}
          className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/92 p-6"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- lightbox: dynamic URL, avoid layout shift */}
          <img
            src={active}
            alt={images.find((i) => i.src === active)?.alt ?? "Imagem ampliada da galeria"}
            className="max-h-[88vh] max-w-full object-contain shadow-tactical"
          />
        </div>
      )}
    </section>
  );
}
