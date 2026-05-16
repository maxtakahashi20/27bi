"use client";

import { motion, useReducedMotion } from "framer-motion";

const timeline = [
  {
    year: "1945",
    title: "Origens",
    text: "Criado em 1945, o 27º BI Pqdt herda tradições de combate e disciplina forjadas na Segunda Guerra Mundial.",
  },
  {
    year: "Contínua",
    title: "Operações",
    text: "Missões aeroterrestres, GLO, ações de presença e pronta resposta em todo o território nacional.",
  },
  {
    year: "Hoje",
    title: "Excelência",
    text: "Salto livre, mestre de salto, patrulha de longo alcance, SERE e operações em selva — formação permanente.",
  },
  {
    year: "Estrutura",
    title: "Organização",
    text: "Companhias de Fuzileiros, Comando, Apoio e Pelotão de Comandos. Subordinado à Bda Inf Pqdt.",
  },
];

export function About() {
  const reduce = useReducedMotion();
  const years = new Date().getFullYear() - 1945;

  return (
    <section id="sobre" className="relative bg-olive-deep py-24 sm:py-28 diagonal-top grain">
      <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-[length:40px_40px] opacity-[0.12]" aria-hidden />
      <div className="relative z-[1] mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="mb-16 text-center lg:text-left">
          <span className="font-subtitle text-[10px] uppercase tracking-[0.45em] text-gold">História &amp; identidade</span>
          <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-ice md:text-5xl lg:text-6xl">
            Sobre o Batalhão
          </h2>
          <div className="mx-auto mt-4 h-px w-20 bg-gold lg:mx-0" />
        </div>

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: reduce ? 0 : 0.55 }}
              className="font-body text-base leading-relaxed text-ice/85 md:text-lg"
            >
              <p>
                O 27º Batalhão de Infantaria Paraquedista integra a força de elite da Brigada de Infantaria Paraquedista,
                com treinamento intenso em TFM, instrução técnica de salto e qualificação operacional contínua.
              </p>
              <p className="mt-5">
                Cada paraquedista carrega o compromisso com a soberania nacional e com o companheiro de farda — na terra
                ou no ar.
              </p>
            </motion.div>

            <div className="mt-10 flex flex-wrap gap-10 border-y border-gold/25 py-8">
              <div>
                <p className="font-display text-5xl text-gold md:text-6xl">
                  {years}
                  <span className="text-gold/90">+</span>
                </p>
                <p className="mt-2 font-subtitle text-[10px] uppercase tracking-[0.3em] text-ice/60">Anos de história</p>
              </div>
              <div>
                <p className="font-display text-5xl text-gold md:text-6xl">4</p>
                <p className="mt-2 font-subtitle text-[10px] uppercase tracking-[0.3em] text-ice/60">Eixos operacionais</p>
              </div>
            </div>

            <motion.blockquote
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: reduce ? 0 : 0.12, duration: reduce ? 0 : 0.55 }}
              className="relative mt-12 border-l-4 border-gold bg-tactical/50 pl-8 pr-4 py-6"
            >
              <span
                className="pointer-events-none absolute left-2 top-2 font-display text-7xl leading-none text-gold/25"
                aria-hidden
              >
                &ldquo;
              </span>
              <p className="relative z-[1] font-body text-lg italic leading-relaxed text-ice/90 md:text-xl">
                A missão não termina quando os pés tocam o solo — ela começa de novo, com a mesma honra.
              </p>
            </motion.blockquote>
          </div>

          <div className="lg:col-span-5">
            <div className="relative pl-8">
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gold/40" aria-hidden />
              <ul className="space-y-10">
                {timeline.map((item, i) => (
                  <motion.li
                    key={item.year + item.title}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ delay: reduce ? 0 : i * 0.07, duration: reduce ? 0 : 0.45 }}
                    className="relative"
                  >
                    <span className="absolute -left-[26px] top-1.5 h-3 w-3 border-2 border-olive-deep bg-gold shadow-[0_0_12px_rgba(201,162,39,0.45)]" aria-hidden />
                    <time className="font-subtitle text-xs uppercase tracking-[0.25em] text-gold">{item.year}</time>
                    <h3 className="mt-2 font-display text-xl uppercase tracking-[0.1em] text-ice">{item.title}</h3>
                    <p className="mt-2 font-body text-sm leading-relaxed text-ice/75">{item.text}</p>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
