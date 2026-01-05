import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT ? +process.env.PORT : 4000);
  console.log("Backend listening on", process.env.PORT || 4000);
}

bootstrap();
