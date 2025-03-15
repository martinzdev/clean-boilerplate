import { Injectable, LoggerService as NestLoggerService } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export interface LogMetadata {
  context?: string;
  [key: string]: any;
}

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly environment: string;

  constructor(private readonly configService: ConfigService) {
    this.environment = this.configService.get("NODE_ENV") || "development";
  }

  private formatMessage(message: string, metadata?: LogMetadata): string {
    const timestamp = new Date().toISOString();
    const context = metadata?.context || "Application";
    const metadataString = metadata ? JSON.stringify(metadata) : "";

    return `[${timestamp}] [${context}] ${message} ${metadataString}`;
  }

  log(message: string, metadata?: LogMetadata) {
    console.log(this.formatMessage(message, metadata));
  }

  error(message: string, metadata?: LogMetadata) {
    console.error(this.formatMessage(`ERROR: ${message}`, metadata));

    // Em produção, poderíamos enviar para um serviço de monitoramento
    if (this.environment === "production") {
      // TODO: Integrar com serviço de monitoramento (ex: Sentry, NewRelic, etc)
    }
  }

  warn(message: string, metadata?: LogMetadata) {
    console.warn(this.formatMessage(`WARN: ${message}`, metadata));
  }

  debug(message: string, metadata?: LogMetadata) {
    if (this.environment !== "production") {
      console.debug(this.formatMessage(`DEBUG: ${message}`, metadata));
    }
  }
}
