"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { submitEnlistment } from "@/services/applications";
import { PARAQUEDISTA_COURSE_ID, MARKETPLACE_EVENT } from "@/lib/course-config";
import { INSTITUTION_OPTIONS } from "@/lib/institutions";
import { springSnappy } from "@/lib/landing-motion";
import { cn } from "@/lib/utils";

const slides = [
  { src: "/landing/hero-background.webp", alt: "Ambiente operacional" },
  { src: "/landing/batalhao-precursores.jpg", alt: "Memória institucional" },
  { src: "/landing/tropas-em-campo.jpg", alt: "Atividades em campo" },
] as const;

const six = z
  .string()
  .transform((s) => s.replace(/\D/g, ""))
  .refine((s) => /^\d{6}$/.test(s), "Informe exatamente 6 dígitos numéricos");

const formSchema = z.object({
  fullName: z.string().min(3, "Nome obrigatório"),
  rg: six,
  phone: six,
  discordTag: z
    .string()
    .min(2, "Usuário Discord obrigatório")
    .max(64)
    .transform((s) => s.replace(/^@+/, "").trim()),
  institution: z.enum([
    "POLICIA_MILITAR",
    "GUARDA_CIVIL",
    "POLICIA_FEDERAL",
    "POLICIA_CIVIL",
    "EXERCITO",
    "OUTRO",
  ]),
});

type FormData = z.infer<typeof formSchema>;

export function CourseMarketplace() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [slide, setSlide] = useState(0);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      institution: "POLICIA_MILITAR",
    },
  });

  useEffect(() => {
    const fn = () => setOpen(true);
    window.addEventListener(MARKETPLACE_EVENT, fn);
    return () => window.removeEventListener(MARKETPLACE_EVENT, fn);
  }, []);

  useEffect(() => {
    if (!open || reduce) return;
    const t = window.setInterval(() => setSlide((s) => (s + 1) % slides.length), 5200);
    return () => window.clearInterval(t);
  }, [open, reduce]);

  const close = useCallback(() => {
    setOpen(false);
    reset();
    setSlide(0);
  }, [reset]);

  const onSubmit = async (data: FormData) => {
    const parsed = formSchema.safeParse(data);
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      Object.entries(fe).forEach(([k, v]) => {
        const m = v?.[0];
        if (m) setError(k as keyof FormData, { message: m });
      });
      toast.error("Verifique os campos destacados.");
      return;
    }
    try {
      await submitEnlistment({
        fullName: parsed.data.fullName,
        rg: parsed.data.rg,
        phone: parsed.data.phone,
        discordTag: parsed.data.discordTag,
        institution: parsed.data.institution,
        courseId: PARAQUEDISTA_COURSE_ID,
      });
      toast.success("Inscrição enviada! Aguarde retorno da coordenação.");
      close();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Falha ao enviar");
    }
  };

  const input =
    "w-full rounded border border-gold/35 bg-tactical/90 px-3 py-2.5 font-body text-sm text-ice placeholder:text-ice/35 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="marketplace"
          className="fixed inset-0 z-[90] flex items-end justify-center bg-black/85 p-0 sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="marketplace-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            className="flex h-[100dvh] w-full max-w-6xl flex-col overflow-hidden border-gold/40 bg-ink-800 shadow-2xl sm:h-[min(92dvh,880px)] sm:max-h-[92dvh] sm:flex-row sm:rounded-lg sm:border-2"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={springSnappy}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex min-h-[38vh] flex-1 flex-col bg-tactical sm:min-h-0">
              <div className="relative flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={slide}
                    className="absolute inset-0"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -32 }}
                    transition={{ duration: reduce ? 0 : 0.45 }}
                  >
                    <Image
                      src={slides[slide].src}
                      alt={slides[slide].alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-tactical via-tactical/20 to-transparent" />
              </div>
              <div className="pointer-events-none absolute left-3 top-3 rounded border border-gold/40 bg-tactical/70 px-2 py-1 font-subtitle text-[9px] uppercase tracking-[0.2em] text-gold">
                Galeria
              </div>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Slide ${i + 1}`}
                    onClick={() => setSlide(i)}
                    className={cn(
                      "h-2 w-2 rounded-full transition",
                      i === slide ? "bg-gold scale-125" : "bg-ice/30 hover:bg-ice/50",
                    )}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setSlide((s) => (s - 1 + slides.length) % slides.length)}
                className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-gold/40 bg-tactical/80 text-gold hover:bg-gold/20"
                aria-label="Imagem anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setSlide((s) => (s + 1) % slides.length)}
                className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-gold/40 bg-tactical/80 text-gold hover:bg-gold/20"
                aria-label="Próxima imagem"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="flex max-h-[62vh] flex-1 flex-col overflow-y-auto border-t border-gold/25 bg-ink-900/95 sm:max-h-none sm:border-l sm:border-t-0">
              <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-gold/20 bg-ink-900/95 px-5 py-4 backdrop-blur">
                <div>
                  <p className="font-subtitle text-[10px] uppercase tracking-[0.35em] text-gold/90">Inscrição</p>
                  <h2 id="marketplace-title" className="font-display text-2xl uppercase tracking-[0.1em] text-ice sm:text-3xl">
                    Curso de Paraquedista
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="shrink-0 border border-gold/35 p-2 text-gold hover:bg-gold/10"
                  aria-label="Fechar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-5 px-5 py-5 text-sm">
                <div className="space-y-2 text-ice/75">
                  <p>
                    Programa em fase de divulgação. Abaixo você envia apenas os dados solicitados pela coordenação; o
                    conteúdo completo do curso e requisitos finais serão informados depois.
                  </p>
                  <ul className="list-inside list-disc space-y-1 text-xs text-ice/60">
                    <li>Público: integrantes de forças de segurança e órgãos correlatos.</li>
                    <li>Modalidade e carga horária: a definir.</li>
                    <li>Certificação: conforme regulamento da unidade.</li>
                  </ul>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border-t border-gold/15 pt-5">
                  <label className="flex flex-col gap-1">
                    <span className="font-subtitle text-[10px] uppercase tracking-[0.2em] text-gold/90">Nome completo</span>
                    <input {...register("fullName")} className={input} autoComplete="name" />
                    {errors.fullName && <span className="text-xs text-red-400">{errors.fullName.message}</span>}
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="font-subtitle text-[10px] uppercase tracking-[0.2em] text-gold/90">RG (6 dígitos)</span>
                    <input {...register("rg")} inputMode="numeric" className={input} placeholder="000000" maxLength={14} />
                    {errors.rg && <span className="text-xs text-red-400">{errors.rg.message}</span>}
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="font-subtitle text-[10px] uppercase tracking-[0.2em] text-gold/90">Telefone (6 dígitos)</span>
                    <input {...register("phone")} inputMode="numeric" className={input} placeholder="000000" maxLength={14} />
                    {errors.phone && <span className="text-xs text-red-400">{errors.phone.message}</span>}
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="font-subtitle text-[10px] uppercase tracking-[0.2em] text-gold/90">Discord (usuário)</span>
                    <input {...register("discordTag")} className={input} placeholder="usuario" autoComplete="username" />
                    {errors.discordTag && <span className="text-xs text-red-400">{errors.discordTag.message}</span>}
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="font-subtitle text-[10px] uppercase tracking-[0.2em] text-gold/90">Guarnição / órgão</span>
                    <select {...register("institution")} className={input}>
                      {INSTITUTION_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    {errors.institution && <span className="text-xs text-red-400">{errors.institution.message}</span>}
                  </label>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full border-2 border-gold bg-gold py-3 font-subtitle text-[11px] uppercase tracking-[0.28em] text-tactical hover:bg-transparent hover:text-gold disabled:opacity-50"
                  >
                    {isSubmitting ? "Enviando…" : "Enviar inscrição"}
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
