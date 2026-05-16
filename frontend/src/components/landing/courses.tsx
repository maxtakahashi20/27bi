"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { CalendarDays, ShieldCheck, Users } from "lucide-react";

type Course = {
  id: string;
  name: string;
  description: string;
  duration: string;
  requirements: string;
  slots: number;
  status: string;
};

const fallback: Course[] = [
  {
    id: "1",
    name: "Curso de Operações Táticas",
    description: "Táticas de combate em ambientes urbanos e selvagens.",
    duration: "8 semanas",
    requirements: "Aptidão física, 18-30 anos",
    slots: 25,
    status: "OPEN",
  },
  {
    id: "2",
    name: "Curso Paraquedista",
    description: "Salto e operações aeroterrestres.",
    duration: "12 semanas",
    requirements: "Aptidão e exame médico",
    slots: 30,
    status: "OPEN",
  },
  {
    id: "3",
    name: "Curso de Patrulhamento",
    description: "Reconhecimento e patrulha de longa duração.",
    duration: "6 semanas",
    requirements: "Curso básico militar",
    slots: 20,
    status: "OPEN",
  },
  {
    id: "4",
    name: "Curso de Sobrevivência",
    description: "Técnicas SERE em ambientes hostis.",
    duration: "4 semanas",
    requirements: "Aptidão física",
    slots: 15,
    status: "OPEN",
  },
  {
    id: "5",
    name: "Curso de Formação Militar",
    description: "Formação inicial do soldado paraquedista.",
    duration: "16 semanas",
    requirements: "18-22 anos, ensino médio",
    slots: 50,
    status: "OPEN",
  },
];

export function Courses() {
  const reduce = useReducedMotion();
  const [courses, setCourses] = useState<Course[]>(fallback);
  useEffect(() => {
    api
      .get("/courses")
      .then((r) => r.data?.length && setCourses(r.data))
      .catch(() => {});
  }, []);

  return (
    <section id="cursos" className="relative border-t border-gold/20 bg-gradient-to-b from-tactical to-ink-800 py-24 sm:py-28 grain">
      <div className="relative z-[1] mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="mb-16 text-center">
          <span className="font-subtitle text-[10px] uppercase tracking-[0.45em] text-gold">Formação</span>
          <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-ice md:text-5xl lg:text-6xl">
            Cursos disponíveis
          </h2>
          <div className="mx-auto mt-4 h-px w-20 bg-gold" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((c, i) => (
            <motion.article
              key={c.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: reduce ? 0 : i * 0.05, duration: reduce ? 0 : 0.45 }}
              className="group flex flex-col border border-gold/20 border-t-[3px] border-t-gold bg-ink-800/90 p-6 shadow-tactical transition duration-tactical hover:border-gold/60 hover:shadow-gold"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-xl uppercase tracking-[0.1em] text-ice">{c.name}</h3>
                <span className="shrink-0 border border-gold/50 px-2 py-1 font-subtitle text-[9px] uppercase tracking-[0.2em] text-gold/90">
                  {c.status}
                </span>
              </div>
              <p className="mt-4 flex-1 font-body text-sm leading-relaxed text-ice/75">{c.description}</p>
              <div className="mt-6 space-y-2 border-t border-gold/15 pt-4 font-body text-xs text-ice/80">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 shrink-0 text-gold" aria-hidden />
                  {c.duration}
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-gold" aria-hidden />
                  {c.requirements}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 shrink-0 text-gold" aria-hidden />
                  {c.slots} vagas
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
