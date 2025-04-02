import { EnvModule } from "@/infra/env/env.module";
import { EnvService } from "@/infra/env/env.service";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SessionEntity } from "../../../modules/identity/infra/persistence/typeorm/entities/session.entity";
import { UserEntity } from "../../../modules/identity/infra/persistence/typeorm/entities/user.entity";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [EnvModule],

      inject: [EnvService],

      useFactory(env: EnvService) {
        const databaseUrl = env.get("DATABASE_URL");
        const schema = env.get("DATABASE_SCHEMA");

        return {
          type: "postgres",
          url: databaseUrl,
          entities: [UserEntity, SessionEntity],
          synchronize: true,
          logging: true,
          schema: process.env.DATABASE_SCHEMA || schema,
        };
      },
    }),

    TypeOrmModule.forFeature([UserEntity, SessionEntity]),
  ],

  exports: [TypeOrmModule],
})
export class TypeOrmConfigModule {}
