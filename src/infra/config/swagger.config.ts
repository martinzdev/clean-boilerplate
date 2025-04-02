import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { EnvService } from "../env/env.service";
import { ServerConfig } from "./app.config";

export class SwaggerConfig {
  constructor(
    private readonly serverConfig: ServerConfig,
    private readonly envService: EnvService
  ) {}

  setup(): void {
    const config = new DocumentBuilder()
      .setTitle("REPLIC API")
      // .setDescription('API description')
      .setVersion(this.serverConfig.apiVersion)
      .addBearerAuth()
      .build();

    const path = this.envService.get("SWAGGER_PATH");

    const document = SwaggerModule.createDocument(
      this.serverConfig.app,
      config
    );
    SwaggerModule.setup(path, this.serverConfig.app, () => document);
  }
}
