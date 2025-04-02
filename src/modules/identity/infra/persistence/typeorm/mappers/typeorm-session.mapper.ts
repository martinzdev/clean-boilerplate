import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Session } from "@/modules/identity/domain/entities/session";
import { SessionEntity } from "@/modules/identity/infra/persistence/typeorm/entities/session.entity";

export class TypeOrmSessionMapper {
  static toDomain(raw: SessionEntity): Session {
    return Session.create(
      {
        userId: raw.userId,
        accessToken: raw.accessToken,
        refreshToken: raw.refreshToken,
        isActive: raw.isActive,
        expiresAt: raw.expiresAt,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPersistence(session: Session): SessionEntity {
    return {
      id: session.id.toString(),
      userId: session.userId,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      isActive: session.isActive,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  }

  static toFilter(filter?: Partial<Session>): Record<string, any> {
    if (!filter) return {};

    const persistenceFilter: Record<string, any> = {};

    if (filter.id) persistenceFilter.id = filter.id.toString();
    if (filter.userId) persistenceFilter.userId = filter.userId;
    if (filter.accessToken) persistenceFilter.accessToken = filter.accessToken;
    if (filter.refreshToken)
      persistenceFilter.refreshToken = filter.refreshToken;
    if (filter.isActive) persistenceFilter.isActive = filter.isActive;
    if (filter.expiresAt) persistenceFilter.expiresAt = filter.expiresAt;
    if (filter.createdAt) persistenceFilter.createdAt = filter.createdAt;
    if (filter.updatedAt) persistenceFilter.updatedAt = filter.updatedAt;

    return persistenceFilter;
  }
}
