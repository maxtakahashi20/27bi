import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AdminController } from "./admin.controller";
import { PrismaService } from "../common/prisma.service";
import { DiscordService } from "../discord/discord.service";
import { EmailService } from "../email/email.service";
import { AdminGuard } from "../common/admin.guard";

@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET })],
  controllers: [AdminController],
  providers: [PrismaService, DiscordService, EmailService, AdminGuard],
})
export class AdminModule {}
