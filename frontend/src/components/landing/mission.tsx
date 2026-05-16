"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { springSnappy } from "@/lib/landing-motion";
import { TiltCard } from "./tilt-card";

function IconShield({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        d="M32 6 L52 14 V32 C52 44 44 54 32 58 C20 54 12 44 12 32 V14 Z"
      />
      <path fill="currentColor" fillOpacity="0.2" d="M32 18 L40 36 H24 Z" />
    </svg>
  );
}

function IconCrosshair({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <circle cx="32" cy="32" r="20" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M32 4 V14 M32 50 V60 M4 32 H14 M50 32 H60" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="4" fill="currentColor" fillOpacity="0.35" />
    </svg>
  );
}

function IconChute({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        d="M32 8 C38 20 42 28 42 36 C42 48 38 52 32 56 C26 52 22 48 22 36 C22 28 26 20 32 8Z"
      />
      <path d="M26 38 L32 48 L38 38" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M18 22 L46 22" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
    </svg>
  );
}

const cards = [
  {
    title: "Disciplina",
    body: "Cadeia de comando clara, padrão de excelência e cumprimento da missão acima de qualquer circunstância.",
    Icon: IconShield,
  },
  {
    title: "Precisão",
    body: "Planejamento tático, execução coordenada e domínio do tempo-espaço em operações aeroterrestres.",
    Icon: IconCrosshair,
  },
  {
    title: "Bravura",
    body: "Coragem moral e física para enfrentar ambientes hostis, GLO e pronta resposta em defesa da pátria.",
    Icon: IconChute,
  },
];

export function Mission() {
  const reduce = useReducedMotion();

  return (
    <section id="missao" className="relative border-t border-gold/25 bg-tactical py-24 sm:py-28 grain">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <Image
          src="/landing/tropas-em-campo.jpg"
          alt=""
          fill
          className="object-cover object-center opacity-[0.12]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-tactical via-tactical/92 to-tactical" />
      </div>
      <div className="relative z-[1] mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <motion.div
          className="mb-14 max-w-3xl"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={springSnappy}
        >
          <span className="font-subtitle text-[10px] uppercase tracking-[0.45em] text-gold">Missão &amp; valores</span>
          <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-ice md:text-5xl">Pilar da tropa</h2>
          <div className="mt-4 h-px w-20 bg-gold" />
          <p className="mt-6 font-body text-base leading-relaxed text-ice/75">
            Operações aeroterrestres, presença e pronta resposta — com honra ao uniforme e lealdade à Constituição.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {cards.map((c, i) => (
            <TiltCard key={c.title} className="h-full" tilt={9}>
              <motion.article
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: reduce ? 0 : i * 0.09, ...springSnappy }}
                whileHover={reduce ? undefined : { y: -8, boxShadow: "0 12px 40px rgba(201,162,39,0.15)" }}
                className="group relative h-full border border-gold/25 border-t-[3px] border-t-gold bg-ink-800/80 p-8 shadow-tactical transition-colors duration-tactical hover:border-gold"
              >
                <motion.div whileHover={reduce ? undefined : { rotate: [0, -4, 4, 0], scale: 1.08 }} transition={{ duration: 0.5 }}>
                  <c.Icon className="h-14 w-14 text-gold transition group-hover:text-ice" />
                </motion.div>
                <h3 className="mt-6 font-display text-2xl uppercase tracking-[0.12em] text-ice">{c.title}</h3>
                <p className="mt-4 font-body text-sm leading-relaxed text-ice/75">{c.body}</p>
              </motion.article>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
