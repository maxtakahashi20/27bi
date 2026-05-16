import { NestFactory } from "@nestjs/core";
import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors({ origin: process.env.FRONTEND_URL ?? "http://localhost:3000", credentials: true });
  app.setGlobalPrefix("api");
  await app.listen(process.env.PORT ?? 3333);
  console.log(`Backend rodando em :${process.env.PORT ?? 3333}`);
}
bootstrap();
