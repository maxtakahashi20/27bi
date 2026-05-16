"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PARAQUEDISTA_COURSE_ID, MARKETPLACE_EVENT } from "@/lib/course-config";
import { springSnappy } from "@/lib/landing-motion";
import { TiltCard } from "./tilt-card";
import { CourseMarketplace } from "./course-marketplace";
import type { CourseDto } from "@/types/models";
import { ChevronRight } from "lucide-react";

const PLACEHOLDER_COURSE: CourseDto = {
  id: PARAQUEDISTA_COURSE_ID,
  name: "Curso de Paraquedista",
  description:
    "Formação em arquitetura de sistemas e planejamento. Detalhes do programa serão publicados pela coordenação.",
  duration: "Calendário a divulgar",
  requirements: "Servidor de forças de segurança (ver formulário de inscrição).",
  slots: 999,
  status: "OPEN",
};

export function Courses() {
  const reduce = useReducedMotion();
  const [course, setCourse] = useState<CourseDto>(PLACEHOLDER_COURSE);

  useEffect(() => {
    api
      .get<CourseDto[]>("/courses")
      .then((r) => {
        const list = r.data ?? [];
        const found = list.find((c) => c.id === PARAQUEDISTA_COURSE_ID) ?? list[0];
        if (found) setCourse(found);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="cursos" className="relative border-t border-gold/20 bg-gradient-to-b from-tactical to-ink-800 py-24 sm:py-28 grain">
      <CourseMarketplace />
      <div className="relative z-[1] mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={springSnappy}
        >
          <span className="font-subtitle text-[10px] uppercase tracking-[0.45em] text-gold">Formação</span>
          <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-ice md:text-5xl lg:text-6xl">
            Curso disponível
          </h2>
          <motion.div
            className="mx-auto mt-4 h-px w-20 bg-gold"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "center" }}
          />
          <p className="mx-auto mt-5 max-w-xl font-body text-sm text-ice/65">
            Toque no card para abrir a ficha estilo vitrine, ver imagens e preencher a inscrição.
          </p>
        </motion.div>

        <div className="mx-auto max-w-lg">
          <TiltCard className="h-full" tilt={9}>
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={springSnappy}
              whileHover={reduce ? undefined : { y: -6 }}
              onClick={() => window.dispatchEvent(new CustomEvent(MARKETPLACE_EVENT))}
              className="group relative flex w-full flex-col overflow-hidden border border-gold/25 border-t-[3px] border-t-gold bg-ink-800/95 text-left shadow-tactical transition-shadow hover:border-gold/60 hover:shadow-gold"
            >
              <div className="relative aspect-[21/9] w-full sm:aspect-[2/1]">
                <Image
                  src="/landing/hero-background.webp"
                  alt=""
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 512px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-tactical via-tactical/30 to-transparent" />
                <span className="absolute bottom-3 left-4 font-subtitle text-[10px] uppercase tracking-[0.3em] text-gold/90">
                  Abrir vitrine
                </span>
              </div>
              <div className="space-y-3 p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-2xl uppercase tracking-[0.1em] text-ice">{course.name}</h3>
                  <span className="shrink-0 border border-gold/50 px-2 py-1 font-subtitle text-[9px] uppercase tracking-[0.2em] text-gold/90">
                    {course.status}
                  </span>
                </div>
                <p className="font-body text-sm leading-relaxed text-ice/75">{course.description}</p>
                <div className="flex items-center justify-between border-t border-gold/15 pt-4 font-subtitle text-[10px] uppercase tracking-[0.25em] text-gold/80">
                  <span>{course.duration}</span>
                  <span className="inline-flex items-center gap-1 text-ice group-hover:text-gold">
                    Inscrever-se
                    <ChevronRight className="h-4 w-4" aria-hidden />
                  </span>
                </div>
              </div>
            </motion.button>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
