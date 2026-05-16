"use client";

import { motion, useReducedMotion } from "framer-motion";

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
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-olive-deep/40 to-transparent" aria-hidden />
      <div className="relative z-[1] mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="mb-14 max-w-3xl">
          <span className="font-subtitle text-[10px] uppercase tracking-[0.45em] text-gold">Missão &amp; valores</span>
          <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-ice md:text-5xl">Pilar da tropa</h2>
          <div className="mt-4 h-px w-20 bg-gold" />
          <p className="mt-6 font-body text-base leading-relaxed text-ice/75">
            Operações aeroterrestres, presença e pronta resposta — com honra ao uniforme e lealdade à Constituição.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {cards.map((c, i) => (
            <motion.article
              key={c.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: reduce ? 0 : i * 0.08, duration: reduce ? 0 : 0.5 }}
              className="group relative border border-gold/25 border-t-[3px] border-t-gold bg-ink-800/80 p-8 shadow-tactical transition duration-tactical hover:-translate-y-1 hover:border-gold hover:shadow-gold"
            >
              <c.Icon className="h-14 w-14 text-gold transition group-hover:text-ice" />
              <h3 className="mt-6 font-display text-2xl uppercase tracking-[0.12em] text-ice">{c.title}</h3>
              <p className="mt-4 font-body text-sm leading-relaxed text-ice/75">{c.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
