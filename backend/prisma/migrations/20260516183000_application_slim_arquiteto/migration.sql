-- Nova estrutura de inscrições (curso paraquedista): remove campos antigos, adiciona rg e institution.
-- ATENÇÃO: apaga todas as inscrições existentes.

ALTER TABLE "applications" DROP CONSTRAINT IF EXISTS "applications_course_id_fkey";

DROP TABLE IF EXISTS "applications";

CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "rg" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "discord" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "desired_course" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "course_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "applications_status_idx" ON "applications"("status");
CREATE INDEX "applications_course_id_idx" ON "applications"("course_id");

ALTER TABLE "applications" ADD CONSTRAINT "applications_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "applications" ENABLE ROW LEVEL SECURITY;
