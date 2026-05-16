import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const courses = [
    {
      id: "clbipqcrs0001tactical",
      name: "Curso de Operações Táticas",
      description: "Táticas de combate em ambientes urbanos e selvagens.",
      duration: "8 semanas",
      requirements: "Aptidão física, 18-30 anos",
      slots: 25,
    },
    {
      id: "clbipqcrs0002para",
      name: "Curso Paraquedista",
      description: "Salto e operações aeroterrestres.",
      duration: "12 semanas",
      requirements: "Aptidão e exame médico",
      slots: 30,
    },
    {
      id: "clbipqcrs0003patr",
      name: "Curso de Patrulhamento",
      description: "Reconhecimento e patrulha de longa duração.",
      duration: "6 semanas",
      requirements: "Curso básico militar",
      slots: 20,
    },
    {
      id: "clbipqcrs0004sere",
      name: "Curso de Sobrevivência",
      description: "Técnicas SERE em ambientes hostis.",
      duration: "4 semanas",
      requirements: "Aptidão física",
      slots: 15,
    },
    {
      id: "clbipqcrs0005form",
      name: "Curso de Formação Militar",
      description: "Formação inicial do soldado paraquedista.",
      duration: "16 semanas",
      requirements: "18-22 anos, ensino médio",
      slots: 50,
    },
  ];

  for (const c of courses) {
    await prisma.course.upsert({
      where: { id: c.id },
      update: { ...c, status: "OPEN" },
      create: { ...c, status: "OPEN" },
    });
  }

  console.log("Seed concluído:", courses.length, "cursos.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
