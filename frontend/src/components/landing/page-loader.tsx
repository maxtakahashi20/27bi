"use client";

import { useEffect, useState } from "react";

export function PageLoader() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const t1 = window.setTimeout(() => setFadeOut(true), 350);
    const t2 = window.setTimeout(() => setVisible(false), 1000);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-tactical transition-opacity duration-500 ease-out ${
        fadeOut ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-busy="true"
      aria-label="Carregando"
    >
      <div className="relative flex h-28 w-28 items-center justify-center border border-gold/80 bg-olive-deep/40 shadow-gold">
        <svg viewBox="0 0 100 100" className="h-16 w-16 text-gold" aria-hidden>
          <path
            fill="currentColor"
            fillOpacity="0.15"
            stroke="currentColor"
            strokeWidth="1.5"
            d="M50 8 L88 28 L88 72 L50 92 L12 72 L12 28 Z"
          />
          <text
            x="50"
            y="58"
            textAnchor="middle"
            className="fill-ice font-display text-[22px]"
            style={{ fontFamily: "var(--font-bebas), sans-serif" }}
          >
            27
          </text>
        </svg>
      </div>
      <p className="mt-6 font-subtitle text-[10px] uppercase tracking-[0.45em] text-ice/70">Batalhão Paraquedista</p>
    </div>
  );
}
