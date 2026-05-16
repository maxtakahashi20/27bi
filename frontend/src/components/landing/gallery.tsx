"use client";
import { motion } from "framer-motion";
import { useState } from "react";

const images = [
  "https://images.unsplash.com/photo-1569242840510-c8b56c198c89?w=1200",
  "https://images.unsplash.com/photo-1579912437766-7896df6d3cd6?w=1200",
  "https://images.unsplash.com/photo-1591729803664-7c1d2a905a82?w=1200",
  "https://images.unsplash.com/photo-1517502166878-35c93a0072f0?w=1200",
  "https://images.unsplash.com/photo-1517747614396-d21a78b850e8?w=1200",
  "https://images.unsplash.com/photo-1599839619722-39751411ea63?w=1200",
];

export function Gallery() {
  const [active, setActive] = useState<string | null>(null);
  return (
    <section id="galeria" className="py-28 bg-ink-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-olive-400 tracking-[0.4em] text-xs">REGISTROS</span>
          <h2 className="mt-4 font-display text-3xl md:text-5xl text-olive-50">Galeria operacional</h2>
          <div className="mx-auto mt-4 h-px w-24 bg-olive-600" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {images.map((src, i) => (
            <motion.button
              key={src}
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.04 }}
              onClick={() => setActive(src)}
              className="relative overflow-hidden aspect-[4/3] border border-olive-800/50 group"
            >
              <img src={src} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 to-transparent" />
            </motion.button>
          ))}
        </div>
      </div>

      {active && (
        <div onClick={() => setActive(null)} className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6 cursor-zoom-out">
          <img src={active} className="max-h-full max-w-full object-contain" alt="" />
        </div>
      )}
    </section>
  );
}
