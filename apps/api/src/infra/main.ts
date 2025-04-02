import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ServerConfig } from "./config/app.config";
import { SwaggerConfig } from "./config/swagger.config";
import { EnvService } from "./env/env.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const envService = app.get(EnvService);
  const server = new ServerConfig(app, envService);

  app.enableCors({
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: ["Content-Type", "Accept", "Authorization"],
    credentials: true,
  });

  server.app.setGlobalPrefix(server.apiPath);

  const swagger = new SwaggerConfig(server, envService);
  swagger.setup();

  await server.listen();
}
bootstrap();
