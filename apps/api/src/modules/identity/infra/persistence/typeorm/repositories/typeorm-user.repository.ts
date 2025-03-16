import { UserRepository } from "@/modules/identity/application/ports/repositories/user.repository";
import { User } from "@/modules/identity/domain/entities/user";
import { UserEntity } from "@/modules/identity/infra/persistence/typeorm/entities/user.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TypeOrmUserMapper } from "../mappers/typeorm-user.mapper";

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>
  ) {}

  async save(user: User): Promise<void> {
    const persistenceUser = TypeOrmUserMapper.toPersistence(user);
    await this.repository.save(persistenceUser);
  }
  async findById(id: string): Promise<User | null> {
    const userEntity = await this.repository.findOne({ where: { id } });
    if (!userEntity) return null;
    return TypeOrmUserMapper.toDomain(userEntity);
  }
  async findOne(filter?: Partial<User>): Promise<User | null> {
    const persistenceFilter = TypeOrmUserMapper.toFilter(filter);
    const userEntity = await this.repository.findOne({
      where: persistenceFilter,
    });

    if (!userEntity) return null;
    return TypeOrmUserMapper.toDomain(userEntity);
  }
  async findMany(filter?: Partial<User>): Promise<User[]> {
    const persistenceFilter = TypeOrmUserMapper.toFilter(filter);
    const userEntities = await this.repository.find({
      where: persistenceFilter,
    });

    return userEntities.map(TypeOrmUserMapper.toDomain);
  }
  async exists(filter?: Partial<User>): Promise<boolean> {
    const persistenceFilter = TypeOrmUserMapper.toFilter(filter);
    const count = await this.repository.count({ where: persistenceFilter });
    return count > 0;
  }
  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
