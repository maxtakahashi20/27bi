/** Remove tags e normaliza espaços para evitar XSS em campos de texto. */
export function sanitizeText(input: string, maxLen: number): string {
  const stripped = input
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim();
  return stripped.slice(0, maxLen);
}
