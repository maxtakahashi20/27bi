"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, Shield, X } from "lucide-react";
import { EnlistDialog } from "./enlist-dialog";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [enlist, setEnlist] = useState(false);
  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 backdrop-blur bg-ink-900/70 border-b border-olive-800/60">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-olive-200">
            <Shield className="h-6 w-6 text-olive-400" />
            <span className="font-display tracking-wider">27º BI Pqdt</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-olive-200/80">
            <a href="#sobre" className="hover:text-olive-200">Sobre</a>
            <a href="#cursos" className="hover:text-olive-200">Cursos</a>
            <a href="#galeria" className="hover:text-olive-200">Galeria</a>
            <Link href="/admin" className="hover:text-olive-200">Admin</Link>
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEnlist(true)}
              className="hidden md:inline-flex items-center rounded border border-olive-400/70 bg-olive-700/40 px-4 py-2 text-sm font-semibold text-olive-50 tracking-wider hover:bg-olive-600/60 transition"
            >
              ALISTAR-SE
            </button>
            <button className="md:hidden text-olive-200" onClick={() => setOpen(!open)}>
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {open && (
          <div className="md:hidden border-t border-olive-800/60 bg-ink-900/95 px-4 py-4 flex flex-col gap-3 text-olive-200/90">
            <a href="#sobre" onClick={() => setOpen(false)}>Sobre</a>
            <a href="#cursos" onClick={() => setOpen(false)}>Cursos</a>
            <a href="#galeria" onClick={() => setOpen(false)}>Galeria</a>
            <Link href="/admin" onClick={() => setOpen(false)}>Admin</Link>
            <button
              onClick={() => { setEnlist(true); setOpen(false); }}
              className="mt-2 rounded border border-olive-400/70 bg-olive-700/40 px-4 py-2 font-semibold"
            >
              ALISTAR-SE
            </button>
          </div>
        )}
      </header>
      <EnlistDialog open={enlist} onClose={() => setEnlist(false)} />
    </>
  );
}
