/** Deve coincidir com o `id` do curso no seed do backend (`PARAQUEDISTA_COURSE_ID`). */
export const PARAQUEDISTA_COURSE_ID =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_PARAQUEDISTA_COURSE_ID
    ? process.env.NEXT_PUBLIC_PARAQUEDISTA_COURSE_ID
    : "clcoursearquiteto001";

export const MARKETPLACE_EVENT = "open-course-marketplace";

export function openCourseMarketplace() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(MARKETPLACE_EVENT));
  document.getElementById("cursos")?.scrollIntoView({ behavior: "smooth", block: "start" });
}
