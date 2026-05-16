import { Module } from "@nestjs/common";
import { ThrottlerModule } from "@nestjs/throttler";
import { PrismaService } from "./common/prisma.service";
import { ApplicationsModule } from "./applications/applications.module";
import { CoursesModule } from "./courses/courses.module";
import { AdminModule } from "./admin/admin.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),
    AuthModule,
    ApplicationsModule,
    CoursesModule,
    AdminModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
