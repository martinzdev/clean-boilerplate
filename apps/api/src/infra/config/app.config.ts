import { INestApplication, Logger } from "@nestjs/common";
import { EnvService } from "../env/env.service";

export class ServerConfig {
  public app: INestApplication;

  constructor(
    instance: INestApplication,
    private readonly envService: EnvService
  ) {
    this.app = instance;
  }

  private logger = new Logger();

  get appHost(): string {
    return this.envService.get("HOST");
  }

  get appPort(): number {
    return this.envService.get("PORT");
  }

  get apiVersion(): string {
    return this.envService.get("API_VERSION");
  }

  get apiPath(): string {
    return this.envService.get("API_PATH");
  }

  private getPaths() {
    const host =
      this.envService.get("NODE_ENV") === "development"
        ? `${this.appHost}:${this.appPort}`
        : this.appHost;

    const path = this.appHost.startsWith("http") ? host : `http://${host}`;

    return {
      base: path,
      api: `${path}/api`,
      docs: `${path}/docs`,
    };
  }

  public async listen() {
    const { base, api, docs } = this.getPaths();
    const serverStartLog = `\x1b[1mServer\x1b[0m is running on: \x1b[36m${base}\x1b[0m`;
    const apiStartLog = `\x1b[1mAPI\x1b[0m is running on: \x1b[36m${api}\x1b[0m`;
    const swaggerStartLog = `\x1b[1mSwagger\x1b[0m is running on: \x1b[36m${docs}\x1b[0m`;

    this.app.listen(this.appPort).then(() => {
      this.logger.log(serverStartLog);
      this.logger.log(apiStartLog);
      this.logger.log(swaggerStartLog);
    });
  }
}
