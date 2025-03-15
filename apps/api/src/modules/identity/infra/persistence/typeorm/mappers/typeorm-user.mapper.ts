import { UniqueEntityID } from "@/@shared/core/entities/unique-entity-id";
import { UserEntity } from "@/infra/database/typeorm/user.entity";
import { User } from "@/modules/identity/domain/entities/user";

export class TypeOrmUserMapper {
  static toDomain(raw: UserEntity): User {
    return User.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPersistence(user: User): UserEntity {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toFilter(filter?: Partial<User>): Record<string, any> {
    if (!filter) return {};

    const persistenceFilter: Record<string, any> = {};

    if (filter.id) persistenceFilter.id = filter.id.toString();
    if (filter.name) persistenceFilter.name = filter.name;
    if (filter.email) persistenceFilter.email = filter.email;
    if (filter.password) persistenceFilter.password = filter.password;
    if (filter.createdAt) persistenceFilter.createdAt = filter.createdAt;
    if (filter.updatedAt) persistenceFilter.updatedAt = filter.updatedAt;

    return persistenceFilter;
  }
}
