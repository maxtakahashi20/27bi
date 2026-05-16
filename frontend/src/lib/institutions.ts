export const INSTITUTION_OPTIONS = [
  { value: "POLICIA_MILITAR", label: "Polícia Militar" },
  { value: "GUARDA_CIVIL", label: "Guarda Civil Municipal (GCM)" },
  { value: "POLICIA_FEDERAL", label: "Polícia Federal" },
  { value: "POLICIA_CIVIL", label: "Polícia Civil" },
  { value: "EXERCITO", label: "Exército Brasileiro" },
  { value: "OUTRO", label: "Outra guarnição / órgão" },
] as const;

export type InstitutionCode = (typeof INSTITUTION_OPTIONS)[number]["value"];

export function institutionLabel(code: string): string {
  return INSTITUTION_OPTIONS.find((o) => o.value === code)?.label ?? code;
}
