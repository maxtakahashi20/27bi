import { Module } from "@nestjs/common";
import { ApplicationsController } from "./applications.controller";
import { PrismaService } from "../common/prisma.service";
import { DiscordService } from "../discord/discord.service";

@Module({
  controllers: [ApplicationsController],
  providers: [PrismaService, DiscordService],
})
export class ApplicationsModule {}
