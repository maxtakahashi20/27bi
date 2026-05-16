import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { PrismaService } from "../common/prisma.service";
import { DiscordService } from "../discord/discord.service";

@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: "7d" } })],
  controllers: [AuthController],
  providers: [PrismaService, DiscordService],
})
export class AuthModule {}
