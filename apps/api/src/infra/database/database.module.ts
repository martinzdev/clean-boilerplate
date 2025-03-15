import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EnvModule } from "../env/env.module";
import { EnvService } from "../env/env.service";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory(env: EnvService) {
        const databaseUrl = env.get("DATABASE_URL");

        return {
          type: "postgres",
          url: databaseUrl,
          entities: [__dirname + "/typeorm/**/*.entity{.ts,.js}"],
          synchronize: true,
          logging: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
