"use client";

import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { openCourseMarketplace } from "@/lib/course-config";
import { SITE_LOGO } from "@/lib/branding";
import { springBouncy, springSnappy, springSoft, staggerContainer } from "@/lib/landing-motion";

const HERO_IMG = "/landing/hero-background.webp";

const TITLE = "27º Batalhão de Infantaria Paraquedista";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 140]);
  const bgScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 1.12]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springMx = useSpring(mx, { stiffness: 220, damping: 26 });
  const springMy = useSpring(my, { stiffness: 220, damping: 26 });
  const logoX = useTransform(springMx, (v) => v * 0.35);
  const logoY = useTransform(springMy, (v) => v * 0.35);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${springMx}px ${springMy}px, rgba(201,162,39,0.14), transparent 65%)`;

  const onHeroPointer = (e: React.PointerEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  const words = TITLE.split(" ");

  return (
    <section
      ref={ref}
      className="relative min-h-[100dvh] w-full overflow-hidden grain"
      onPointerMove={onHeroPointer}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <motion.div style={{ y, scale: bgScale }} className="absolute inset-0">
        <Image
          src={HERO_IMG}
          alt="Ambiente operacional — imagem institucional do 27º BI Pqdt"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </motion.div>

      <motion.div className="pointer-events-none absolute inset-0 z-[1]" style={{ background: glow }} aria-hidden />

      <div className="absolute inset-0 bg-hero-olive" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-t from-tactical via-transparent to-tactical/40" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-[length:48px_48px] opacity-30" aria-hidden />

      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-4 pb-28 pt-24 text-center sm:px-6"
      >
        <motion.div
          initial="hidden"
          animate="show"
          variants={reduce ? { hidden: {}, show: {} } : staggerContainer}
          className="mb-8 flex flex-col items-center"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.85, rotate: -4 },
              show: { opacity: 1, scale: 1, rotate: 0, transition: springBouncy },
            }}
            style={{ x: logoX, y: logoY }}
            className="relative"
          >
            <motion.div
              className="relative h-28 w-28 border-2 border-gold bg-tactical/40 shadow-gold sm:h-32 sm:w-32"
              whileHover={reduce ? undefined : { scale: 1.04, boxShadow: "0 0 40px rgba(201,162,39,0.35)" }}
              transition={springSnappy}
            >
              <Image
                src={SITE_LOGO.src}
                alt={SITE_LOGO.alt}
                fill
                priority
                className="object-contain p-2 drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)]"
                sizes="(max-width: 640px) 7rem, 8rem"
              />
              <motion.span
                className="pointer-events-none absolute -inset-1 border border-gold/30"
                animate={reduce ? undefined : { opacity: [0.35, 0.9, 0.35] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden
              />
            </motion.div>
          </motion.div>
          <motion.span
            variants={{
              hidden: { opacity: 0, y: 8 },
              show: { opacity: 1, y: 0, transition: springSnappy },
            }}
            className="mt-4 font-subtitle text-[10px] uppercase tracking-[0.5em] text-gold/90"
          >
            Exército Brasileiro — Brigada de Infantaria Paraquedista
          </motion.span>
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: reduce ? 0 : 0.045, delayChildren: reduce ? 0 : 0.08 },
            },
          }}
          className="max-w-5xl font-display text-4xl uppercase leading-[1.05] tracking-[0.06em] text-ice text-shadow-tactical sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
        >
          {words.map((w, i) => (
            <motion.span
              key={`${w}-${i}`}
              variants={{
                hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
                show: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { ...springSnappy, duration: reduce ? 0 : undefined },
                },
              }}
              className="inline-block pr-[0.15em] last:pr-0"
            >
              {w}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduce ? 0 : 0.45, ...springSnappy }}
          className="mt-6 max-w-2xl font-subtitle text-sm font-medium uppercase leading-relaxed tracking-[0.18em] text-ice/85 md:text-base"
        >
          Força, precisão e honra — forjados no ar, vitoriosos em terra.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduce ? 0 : 0.58, ...springSoft }}
          className="mt-5 max-w-xl font-body text-sm leading-relaxed text-ice/80 md:text-base"
        >
          Selecionamos os melhores combatentes para missões aeroterrestres em qualquer ponto do território nacional.
        </motion.p>

        <motion.button
          type="button"
          id="alistar"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduce ? 0 : 0.72, ...springSnappy }}
          whileHover={reduce ? undefined : { scale: 1.05, letterSpacing: "0.42em" }}
          whileTap={reduce ? undefined : { scale: 0.96 }}
          onClick={() => openCourseMarketplace()}
          className="mt-12 border-2 border-gold bg-transparent px-10 py-3 font-subtitle text-xs uppercase tracking-[0.35em] text-gold transition-[box-shadow] duration-300 hover:bg-gold hover:text-tactical hover:shadow-[0_0_32px_rgba(201,162,39,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-olive-deep"
        >
          Realizar alistamento
        </motion.button>
      </motion.div>

      <div
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-gold/70"
        aria-hidden
      >
        <span className="font-subtitle text-[9px] uppercase tracking-[0.45em]">Role</span>
        <motion.span
          className="h-8 w-px bg-gradient-to-b from-gold to-transparent"
          animate={reduce ? undefined : { y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

    </section>
  );
}
