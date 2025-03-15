import { UserRepository } from "@/modules/identity/application/ports/repositories/user.repository";
import { TypeOrmUserRepository } from "@/modules/identity/infra/persistence/typeorm/repositories/typeorm-user.repository";
import { Module } from "@nestjs/common";
import { TypeOrmConfigModule as TypeOrmModule } from "./typeorm/typeorm.module";

@Module({
  imports: [TypeOrmModule],
  providers: [
    {
      provide: UserRepository,
      useClass: TypeOrmUserRepository,
    },
  ],
  exports: [UserRepository, TypeOrmModule],
})
export class DatabaseModule {}
