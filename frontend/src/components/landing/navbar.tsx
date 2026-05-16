"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { EnlistDialog } from "./enlist-dialog";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [enlist, setEnlist] = useState(false);
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
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-40 transition-all duration-tactical border-b",
          scrolled
            ? "border-gold/25 bg-olive-deep/92 backdrop-blur-md shadow-tactical"
            : "border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-[4.25rem] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
          <Link
            href="/"
            className="group flex items-center gap-3 text-ice focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-tactical"
          >
            <span className="flex h-10 w-10 items-center justify-center border border-gold/70 bg-tactical/80 text-gold transition group-hover:border-gold group-hover:shadow-gold">
              <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden>
                <path
                  fill="currentColor"
                  fillOpacity="0.12"
                  stroke="currentColor"
                  strokeWidth="1"
                  d="M16 3 L28 10 L28 22 L16 29 L4 22 L4 10 Z"
                />
              </svg>
            </span>
            <span className="font-display text-lg tracking-[0.12em] text-ice sm:text-xl">27º BI Pqdt</span>
          </Link>

          <nav className="hidden items-center gap-10 md:flex" aria-label="Principal">
            <a href="#sobre" className={linkClass}>
              Sobre
            </a>
            <a href="#missao" className={linkClass}>
              Missão
            </a>
            <a href="#cursos" className={linkClass}>
              Cursos
            </a>
            <a href="#galeria" className={linkClass}>
              Galeria
            </a>
            <Link href="/admin" className={linkClass}>
              Admin
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setEnlist(true)}
              className="hidden border border-gold bg-transparent px-5 py-2 font-subtitle text-[10px] uppercase tracking-[0.28em] text-gold transition duration-tactical hover:bg-gold hover:text-tactical md:inline-flex"
            >
              Alistar-se
            </button>

            <button
              type="button"
              className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] border border-gold/50 bg-tactical/60 md:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span
                className={cn(
                  "block h-px w-5 bg-gold transition-transform duration-tactical",
                  menuOpen && "translate-y-[6px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "block h-px w-5 bg-gold transition-opacity duration-tactical",
                  menuOpen && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "block h-px w-5 bg-gold transition-transform duration-tactical",
                  menuOpen && "-translate-y-[6px] -rotate-45",
                )}
              />
            </button>
          </div>
        </div>

        <div
          id="mobile-nav"
          className={cn(
            "overflow-hidden border-t border-gold/20 bg-olive-deep/98 transition-[max-height] duration-tactical md:hidden",
            menuOpen ? "max-h-[420px]" : "max-h-0 border-transparent",
          )}
        >
          <div className="flex flex-col gap-1 px-4 py-5">
            {[
              ["#sobre", "Sobre"],
              ["#missao", "Missão"],
              ["#cursos", "Cursos"],
              ["#galeria", "Galeria"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="font-subtitle py-3 text-xs uppercase tracking-[0.28em] text-ice/90 border-b border-gold/10"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            ))}
            <Link
              href="/admin"
              className="font-subtitle py-3 text-xs uppercase tracking-[0.28em] text-ice/90"
              onClick={() => setMenuOpen(false)}
            >
              Admin
            </Link>
            <button
              type="button"
              onClick={() => {
                setEnlist(true);
                setMenuOpen(false);
              }}
              className="mt-3 border border-gold py-3 font-subtitle text-xs uppercase tracking-[0.28em] text-gold"
            >
              Alistar-se
            </button>
          </div>
        </div>
      </header>
      <EnlistDialog open={enlist} onClose={() => setEnlist(false)} />
    </>
  );
}
