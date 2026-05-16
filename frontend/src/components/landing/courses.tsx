"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { CalendarDays, Users, ShieldCheck } from "lucide-react";

type Course = { id: string; name: string; description: string; duration: string; requirements: string; slots: number; status: string };

const fallback: Course[] = [
  { id: "1", name: "Curso de Operações Táticas", description: "Táticas de combate em ambientes urbanos e selvagens.", duration: "8 semanas", requirements: "Aptidão física, 18-30 anos", slots: 25, status: "OPEN" },
  { id: "2", name: "Curso Paraquedista", description: "Salto e operações aeroterrestres.", duration: "12 semanas", requirements: "Aptidão e exame médico", slots: 30, status: "OPEN" },
  { id: "3", name: "Curso de Patrulhamento", description: "Reconhecimento e patrulha de longa duração.", duration: "6 semanas", requirements: "Curso básico militar", slots: 20, status: "OPEN" },
  { id: "4", name: "Curso de Sobrevivência", description: "Técnicas SERE em ambientes hostis.", duration: "4 semanas", requirements: "Aptidão física", slots: 15, status: "OPEN" },
  { id: "5", name: "Curso de Formação Militar", description: "Formação inicial do soldado paraquedista.", duration: "16 semanas", requirements: "18-22 anos, ensino médio", slots: 50, status: "OPEN" },
];

export function Courses() {
  const [courses, setCourses] = useState<Course[]>(fallback);
  useEffect(() => { api.get("/courses").then(r => r.data?.length && setCourses(r.data)).catch(() => {}); }, []);

  return (
    <section id="cursos" className="relative py-28 bg-gradient-to-b from-ink-900 to-ink-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-olive-400 tracking-[0.4em] text-xs">FORMAÇÃO</span>
          <h2 className="mt-4 font-display text-3xl md:text-5xl text-olive-50">Cursos disponíveis</h2>
          <div className="mx-auto mt-4 h-px w-24 bg-olive-600" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c, i) => (
            <motion.article
              key={c.id}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="rounded border border-olive-800/60 bg-ink-800/70 p-6 hover:border-olive-400/60 transition flex flex-col"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-display text-lg text-olive-100">{c.name}</h3>
                <span className="text-[10px] tracking-widest px-2 py-1 rounded border border-olive-600 text-olive-300">{c.status}</span>
              </div>
              <p className="mt-3 text-sm text-olive-200/75 flex-1">{c.description}</p>
              <div className="mt-5 space-y-2 text-xs text-olive-200/80">
                <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-olive-400" /> {c.duration}</div>
                <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-olive-400" /> {c.requirements}</div>
                <div className="flex items-center gap-2"><Users className="h-4 w-4 text-olive-400" /> {c.slots} vagas</div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
