import { EnvModule } from "@/infra/env/env.module";
import { EnvService } from "@/infra/env/env.service";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SessionEntity } from "./session.entity";
import { UserEntity } from "./user.entity";

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
          entities: [UserEntity, SessionEntity],
          synchronize: true,
          logging: true,
        };
      },
    }),
    TypeOrmModule.forFeature([UserEntity, SessionEntity]),
  ],
  exports: [TypeOrmModule],
})
export class TypeOrmConfigModule {}
