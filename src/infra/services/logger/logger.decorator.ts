import { Logger as LoggerService } from "@nestjs/common";

export function Logger(context?: string) {
  return function (target: any, propertyKey: string | symbol) {
    const loggerContext = context || target.constructor.name;

    Object.defineProperty(target, propertyKey, {
      get: () => {
        return new LoggerService(loggerContext);
      },
      enumerable: true,
      configurable: true,
    });
  };
}
