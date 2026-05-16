"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { SITE_LOGO } from "@/lib/branding";
import { springSnappy, staggerContainer } from "@/lib/landing-motion";

const cols = [
  {
    title: "Institucional",
    links: [
      { href: "#sobre", label: "História" },
      { href: "#missao", label: "Missão" },
      { href: "#cursos", label: "Cursos" },
      { href: "#galeria", label: "Galeria" },
    ],
  },
  {
    title: "Candidato",
    links: [{ href: "#cursos", label: "Alistamento" }],
  },
  {
    title: "Sistema",
    links: [{ href: "/admin", label: "Painel administrativo" }],
  },
];

const linkShift = {
  rest: { x: 0 },
  hover: { x: 8 },
};

export function Footer() {
  return (
    <footer className="border-t-2 border-gold/40 bg-tactical pt-16 pb-10 grain">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <motion.div
          className="flex flex-col gap-12 border-b border-gold/15 pb-14 lg:flex-row lg:items-start lg:justify-between"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
        >
          <motion.div className="max-w-sm" variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: springSnappy } }}>
            <div className="flex items-center gap-3">
              <motion.span
                className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden border border-gold/70 bg-tactical/60"
                whileHover={{ scale: 1.06, rotate: [0, -2, 2, 0] }}
                transition={{ duration: 0.45 }}
              >
                <Image src={SITE_LOGO.src} alt="" width={48} height={48} className="object-contain p-1" />
              </motion.span>
              <div>
                <p className="font-display text-xl uppercase tracking-[0.15em] text-ice">27º BI Pqdt</p>
                <p className="font-subtitle text-[10px] uppercase tracking-[0.35em] text-gold/80">Paraquedista</p>
              </div>
            </div>
            <p className="mt-6 font-body text-sm leading-relaxed text-ice/60">
              Brigada de Infantaria Paraquedista — Exército Brasileiro. Página institucional e canal de alistamento.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:gap-16">
            {cols.map((col, ci) => (
              <motion.div
                key={col.title}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: { opacity: 1, y: 0, transition: { ...springSnappy, delay: 0.08 + ci * 0.06 } },
                }}
              >
                <h3 className="font-subtitle text-[10px] uppercase tracking-[0.35em] text-gold">{col.title}</h3>
                <ul className="mt-4 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href + l.label}>
                      {l.href.startsWith("#") ? (
                        <motion.a
                          href={l.href}
                          className="inline-block font-body text-sm text-ice/70 transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                          initial="rest"
                          whileHover="hover"
                          animate="rest"
                          variants={linkShift}
                          transition={springSnappy}
                        >
                          {l.label}
                        </motion.a>
                      ) : (
                        <motion.div initial="rest" whileHover="hover" animate="rest" variants={linkShift}>
                          <Link
                            href={l.href}
                            className="inline-block font-body text-sm text-ice/70 transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                          >
                            {l.label}
                          </Link>
                        </motion.div>
                      )}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mt-10 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <p className="text-xs text-ice/40">
            © {new Date().getFullYear()} 27º Batalhão de Infantaria Paraquedista — Exército Brasileiro.
          </p>
          <motion.p className="text-xs text-ice/35" whileHover={{ scale: 1.05, color: "rgba(201,162,39,0.85)" }}>
            Brasil acima de tudo.
          </motion.p>
        </motion.div>
      </div>
    </footer>
  );
}
