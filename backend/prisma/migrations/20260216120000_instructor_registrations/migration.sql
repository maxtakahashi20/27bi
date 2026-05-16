ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'INSTRUCTOR';

CREATE TABLE "instructor_registrations" (
  "id" TEXT NOT NULL,
  "discord_id" TEXT NOT NULL,
  "full_name" TEXT NOT NULL,
  "rg" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "graduation" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "instructor_registrations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "instructor_registrations_discord_id_key" ON "instructor_registrations"("discord_id");

ALTER TABLE "instructor_registrations" ENABLE ROW LEVEL SECURITY;
