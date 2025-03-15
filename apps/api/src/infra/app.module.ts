import { Global, MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database/database.module";
import { envSchema } from "./env/env";
import { EnvModule } from "./env/env.module";
import { HttpModule } from "./http/http.module";
import { LoggerHTTPMiddleware } from "./middleware/request.middleware";
import { LoggerModule } from "./services/logger/logger.module";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
    HttpModule,
    LoggerModule,
    DatabaseModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerHTTPMiddleware).forRoutes("*");
  }
}
