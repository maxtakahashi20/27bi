import { Module } from "@nestjs/common";
import { CoursesController } from "./courses.controller";
import { PrismaService } from "../common/prisma.service";

@Module({ controllers: [CoursesController], providers: [PrismaService] })
export class CoursesModule {}
