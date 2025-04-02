import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { User, UserProps } from "@/modules/identity/domain/entities/user";
import { UserEntity } from "@/modules/identity/infra/persistence/typeorm/entities/user.entity";
import { TypeOrmUserMapper } from "@/modules/identity/infra/persistence/typeorm/mappers/typeorm-user.mapper";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID
) {
  const user = User.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id
  );

  return user;
}

@Injectable()
export class UserFactory {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>
  ) {}

  async makeTypeOrmUser(data: Partial<UserProps> = {}): Promise<User> {
    const user = makeUser(data);

    const userEntity = TypeOrmUserMapper.toPersistence(user);

    const savedUser = await this.repository.save(userEntity);

    return TypeOrmUserMapper.toDomain(savedUser);
  }
}
