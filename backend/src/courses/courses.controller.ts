import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";

@Controller("courses")
export class CoursesController {
  constructor(private prisma: PrismaService) {}
  @Get()
  async list() { return this.prisma.course.findMany({ orderBy: { name: "asc" } }); }
}
