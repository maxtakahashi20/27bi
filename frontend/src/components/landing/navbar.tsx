"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { openCourseMarketplace } from "@/lib/course-config";
import { cn } from "@/lib/utils";
import { SITE_LOGO } from "@/lib/branding";
import { springSnappy } from "@/lib/landing-motion";

const navLinks = [
  ["#sobre", "Sobre"],
  ["#missao", "Missão"],
  ["#cursos", "Cursos"],
  ["#galeria", "Galeria"],
] as const;

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 56);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass =
    "font-subtitle text-[11px] uppercase tracking-[0.22em] text-ice/85 transition-colors duration-tactical hover:text-gold relative after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-tactical hover:after:w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-olive-deep";

  return (
    <>
      <motion.header
        layout
        className={cn(
          "fixed top-0 inset-x-0 z-40 border-b transition-all duration-tactical",
          scrolled
            ? "border-gold/25 bg-olive-deep/92 backdrop-blur-md shadow-tactical"
            : "border-transparent bg-transparent",
        )}
        initial={false}
        transition={springSnappy}
      >
        <div className="mx-auto flex h-[4.25rem] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/"
              className="group flex items-center gap-3 text-ice focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-tactical"
            >
              <motion.span
                className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden border border-gold/70 bg-tactical/80"
                whileHover={{ rotate: [0, -2, 2, 0], borderColor: "rgba(201,162,39,0.95)" }}
                transition={{ duration: 0.45 }}
              >
                <Image src={SITE_LOGO.src} alt="" width={40} height={40} className="object-contain p-0.5" />
              </motion.span>
              <span className="font-display text-lg tracking-[0.12em] text-ice sm:text-xl">27º BI Pqdt</span>
            </Link>
          </motion.div>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
            {navLinks.map(([href, label], i) => (
              <motion.a
                key={href}
                href={href}
                className={linkClass}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.05, ...springSnappy }}
                whileHover={{ y: -3 }}
              >
                {label}
              </motion.a>
            ))}
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, ...springSnappy }}>
              <Link href="/admin" className={linkClass}>
                Admin
              </Link>
            </motion.div>
          </nav>

          <div className="flex items-center gap-3">
            <motion.button
              type="button"
              onClick={() => openCourseMarketplace()}
              className="hidden border border-gold bg-transparent px-5 py-2 font-subtitle text-[10px] uppercase tracking-[0.28em] text-gold md:inline-flex"
              whileHover={{ scale: 1.04, backgroundColor: "rgba(201,162,39,0.95)", color: "#0a0f0c" }}
              whileTap={{ scale: 0.96 }}
              transition={springSnappy}
            >
              Alistar-se
            </motion.button>

            <motion.button
              type="button"
              className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] border border-gold/50 bg-tactical/60 md:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((o) => !o)}
              whileTap={{ scale: 0.92 }}
            >
              <motion.span
                className="block h-px w-5 bg-gold"
                animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                transition={springSnappy}
              />
              <motion.span
                className="block h-px w-5 bg-gold"
                animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block h-px w-5 bg-gold"
                animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                transition={springSnappy}
              />
            </motion.button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {menuOpen && (
            <motion.div
              id="mobile-nav"
              key="mobile-nav"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-gold/20 bg-olive-deep/98 md:hidden"
            >
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={{
                  open: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
                  closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
                }}
                className="flex flex-col gap-1 px-4 py-5"
              >
                {navLinks.map(([href, label]) => (
                  <motion.a
                    key={href}
                    href={href}
                    variants={{
                      open: { opacity: 1, x: 0 },
                      closed: { opacity: 0, x: -12 },
                    }}
                    transition={springSnappy}
                    className="font-subtitle py-3 text-xs uppercase tracking-[0.28em] text-ice/90 border-b border-gold/10"
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </motion.a>
                ))}
                <motion.div
                  variants={{
                    open: { opacity: 1, x: 0 },
                    closed: { opacity: 0, x: -12 },
                  }}
                  transition={springSnappy}
                >
                  <Link
                    href="/admin"
                    className="font-subtitle py-3 text-xs uppercase tracking-[0.28em] text-ice/90 block"
                    onClick={() => setMenuOpen(false)}
                  >
                    Admin
                  </Link>
                </motion.div>
                <motion.button
                  type="button"
                  variants={{
                    open: { opacity: 1, y: 0 },
                    closed: { opacity: 0, y: 8 },
                  }}
                  transition={springSnappy}
                  onClick={() => {
                    openCourseMarketplace();
                    setMenuOpen(false);
                  }}
                  className="mt-3 border border-gold py-3 font-subtitle text-xs uppercase tracking-[0.28em] text-gold"
                >
                  Alistar-se
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
