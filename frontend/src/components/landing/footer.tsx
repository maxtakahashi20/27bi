import Link from "next/link";

const cols = [
  {
    title: "Institucional",
    links: [
      { href: "#sobre", label: "História" },
      { href: "#missao", label: "Missão" },
      { href: "#cursos", label: "Cursos" },
      { href: "#galeria", label: "Galeria" },
    ],
  },
  {
    title: "Candidato",
    links: [{ href: "#alistar", label: "Alistamento" }],
  },
  {
    title: "Sistema",
    links: [{ href: "/admin", label: "Painel administrativo" }],
  },
];

export function Footer() {
  return (
    <footer className="border-t-2 border-gold/40 bg-tactical pt-16 pb-10 grain">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-12 border-b border-gold/15 pb-14 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center border border-gold/70 text-gold">
                <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
                  <path
                    fill="currentColor"
                    fillOpacity="0.12"
                    stroke="currentColor"
                    strokeWidth="1"
                    d="M16 3 L28 10 L28 22 L16 29 L4 22 L4 10 Z"
                  />
                </svg>
              </span>
              <div>
                <p className="font-display text-xl uppercase tracking-[0.15em] text-ice">27º BI Pqdt</p>
                <p className="font-subtitle text-[10px] uppercase tracking-[0.35em] text-gold/80">Paraquedista</p>
              </div>
            </div>
            <p className="mt-6 font-body text-sm leading-relaxed text-ice/60">
              Brigada de Infantaria Paraquedista — Exército Brasileiro. Página institucional e canal de alistamento.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:gap-16">
            {cols.map((col) => (
              <div key={col.title}>
                <h3 className="font-subtitle text-[10px] uppercase tracking-[0.35em] text-gold">{col.title}</h3>
                <ul className="mt-4 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href + l.label}>
                      {l.href.startsWith("#") ? (
                        <a
                          href={l.href}
                          className="font-body text-sm text-ice/70 transition hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                        >
                          {l.label}
                        </a>
                      ) : (
                        <Link
                          href={l.href}
                          className="font-body text-sm text-ice/70 transition hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                        >
                          {l.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-ice/40">
            © {new Date().getFullYear()} 27º Batalhão de Infantaria Paraquedista — Exército Brasileiro.
          </p>
          <p className="text-xs text-ice/35">Brasil acima de tudo.</p>
        </div>
      </div>
    </footer>
  );
}
