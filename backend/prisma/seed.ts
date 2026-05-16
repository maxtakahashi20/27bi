import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** ID estável — use o mesmo em `NEXT_PUBLIC_PARAQUEDISTA_COURSE_ID` no frontend. */
export const PARAQUEDISTA_COURSE_ID = "clcoursearquiteto001";

async function main() {
  await prisma.application.deleteMany();
  await prisma.course.deleteMany();

  await prisma.course.create({
    data: {
      id: PARAQUEDISTA_COURSE_ID,
      name: "Curso de Paraquedista",
      description:
        "Formação em operações aeroterrestres e salto de paraquedas. Conteúdo programático, requisitos físicos e cronograma serão divulgados pela coordenação.",
      duration: "Conforme calendário da unidade",
      requirements: "Servidor das forças de segurança listadas no formulário de inscrição.",
      slots: 999,
      status: "OPEN",
    },
  });

  console.log("Seed: 1 curso (Paraquedista), inscrições zeradas.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
