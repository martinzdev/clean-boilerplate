import { SessionRepository } from "@/modules/identity/application/ports/repositories/session.repository";
import { UserRepository } from "@/modules/identity/application/ports/repositories/user.repository";
import { TypeOrmSessionRepository } from "@/modules/identity/infra/persistence/typeorm/repositories/typeorm-session.repository";
import { TypeOrmUserRepository } from "@/modules/identity/infra/persistence/typeorm/repositories/typeorm-user.repository";
import { Module } from "@nestjs/common";

@Module({
  imports: [],
  providers: [
    {
      provide: UserRepository,
      useClass: TypeOrmUserRepository,
    },
    {
      provide: SessionRepository,
      useClass: TypeOrmSessionRepository,
    },
  ],
  exports: [UserRepository, SessionRepository],
})
export class DatabaseModule {}
