import { Injectable, Logger, NestMiddleware } from "@nestjs/common";

import { NextFunction, Request, Response } from "express";

@Injectable()
export class LoggerHTTPMiddleware implements NestMiddleware {
  private logger = new Logger("HTTP");

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl: url } = request;

    response.on("close", () => {
      const { statusCode } = response;

      this.logger.log(`${method} ${url} ${statusCode}`);
    });

    next();
  }
}
