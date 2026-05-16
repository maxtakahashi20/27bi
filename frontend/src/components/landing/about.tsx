"use client";
import { motion } from "framer-motion";
import { History, Target, Award, Dumbbell, Network } from "lucide-react";

const cards = [
  { icon: History, title: "História", body: "Criado em 1945, o 27º BI Pqdt herda tradições de combate e disciplina forjadas na Segunda Guerra Mundial." },
  { icon: Target, title: "Missões", body: "Operações aeroterrestres, GLO, ações de presença e pronta resposta em todo o território nacional." },
  { icon: Award, title: "Especializações", body: "Salto livre, mestre de salto, patrulha de longo alcance, sobrevivência SERE e operações em selva." },
  { icon: Dumbbell, title: "Treinamento", body: "Programas intensivos de TFM, instrução técnica de salto e qualificação operacional permanente." },
  { icon: Network, title: "Estrutura", body: "Companhias de Fuzileiros, Comando, Apoio e Pelotão de Comandos. Subordinado à Bda Inf Pqdt." },
];

export function About() {
  return (
    <section id="sobre" className="relative py-28 bg-ink-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-olive-400 tracking-[0.4em] text-xs">QUEM SOMOS</span>
          <h2 className="mt-4 font-display text-3xl md:text-5xl text-olive-50">Sobre o Batalhão</h2>
          <div className="mx-auto mt-4 h-px w-24 bg-olive-600" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }} transition={{ delay: i * 0.08 }}
              className="group rounded border border-olive-800/60 bg-ink-800/60 p-6 hover:border-olive-400/60 hover:bg-ink-700/60 transition"
            >
              <c.icon className="h-8 w-8 text-olive-400 group-hover:text-olive-200 transition" />
              <h3 className="mt-4 font-display text-xl text-olive-100">{c.title}</h3>
              <p className="mt-2 text-olive-200/75 text-sm leading-relaxed">{c.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
