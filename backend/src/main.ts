import { NestFactory } from "@nestjs/core";
import helmet from "helmet";
import { AppModule } from "./app.module";

function parseCorsOrigins(): string | string[] {
  const raw = process.env.FRONTEND_URL ?? "http://localhost:3000";
  const list = raw
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  return list.length <= 1 ? (list[0] ?? "http://localhost:3000") : list;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors({ origin: parseCorsOrigins(), credentials: true });
  app.setGlobalPrefix("api");
  await app.listen(process.env.PORT ?? 3333);
  console.log(`Backend rodando em :${process.env.PORT ?? 3333}`);
}
bootstrap();
