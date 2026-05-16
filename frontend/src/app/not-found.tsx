import Link from "next/link";
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-900 text-olive-200">
      <div className="text-center">
        <p className="font-display text-7xl text-olive-400">404</p>
        <h1 className="mt-4 text-xl">Posição não localizada no terreno</h1>
        <Link href="/" className="mt-6 inline-block rounded border border-olive-600 px-4 py-2 hover:bg-olive-800/40">Voltar ao QG</Link>
      </div>
    </div>
  );
}
