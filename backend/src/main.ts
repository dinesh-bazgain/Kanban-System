import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DataSource } from "typeorm";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Check DB connection before starting server
  const configService = app.get(ConfigService);
  const dataSource = new DataSource({
    type: "postgres",
    host: configService.get<string>("DB_HOST"),
    port: configService.get<number>("DB_PORT"),
    username: configService.get<string>("DB_USER"),
    password: configService.get<string>("DB_PASS"),
    database: configService.get<string>("DB_NAME"),
  });
  try {
    await dataSource.initialize();
    await dataSource.destroy();
    console.log("Database connection successful");
  } catch (err) {
    console.error("Database connection failed:", (err instanceof Error ? err.message : String(err)));
    process.exit(1);
  }

  await app.listen(process.env.PORT ? +process.env.PORT : 4000);
  console.log("Backend listening on", process.env.PORT || 4000);
}

bootstrap();
