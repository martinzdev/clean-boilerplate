import { UniqueEntityID } from "@/@shared/core/entities/unique-entity-id";
import { SessionEntity } from "@/infra/database/typeorm/entities/session.entity";
import { EncrypterService } from "@/modules/identity/application/ports/services/encrypter-service";
import { Session } from "@/modules/identity/domain/entities/session";
import { TypeOrmSessionMapper } from "@/modules/identity/infra/persistence/typeorm/mappers/typeorm-session.mapper";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FakeEncrypter } from "test/services/fake-encrypter.service";
import { Repository } from "typeorm";

type MakeSessionOptions = {
  userId?: string;
  expiresIn?: number;
  preserveToken?: boolean;
};

export async function makeSession(
  options: MakeSessionOptions = {
    preserveToken: false,
  }
) {
  const encrypter = new FakeEncrypter();

  const userId = options.userId ?? new UniqueEntityID().toString();
  const expiresIn = options.expiresIn ?? 1000 * 60 * 60 * 24 * 7; // 7 days

  const accessTokenPayload = {
    sub: userId,
    type: "access",
  };

  const refreshTokenPayload = {
    sub: userId,
    type: "refresh",
  };

  const accessToken = options.preserveToken
    ? JSON.stringify(accessTokenPayload)
    : await encrypter.encrypt(accessTokenPayload);

  const refreshToken = options.preserveToken
    ? JSON.stringify(refreshTokenPayload)
    : await encrypter.encrypt(refreshTokenPayload);

  const expiresAt = new Date();
  expiresAt.setTime(expiresAt.getTime() + expiresIn);

  const session = Session.create({
    userId,
    accessToken,
    refreshToken,
    expiresAt,
    createdAt: new Date(),
  });

  return session;
}

@Injectable()
export class SessionFactory {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly repository: Repository<SessionEntity>,
    private readonly encrypter: EncrypterService
  ) {}

  async makeTypeOrmSession(
    data: Partial<SessionEntity> = {}
  ): Promise<Session> {
    const session = await makeSession(data);

    const accessToken = await this.encrypter.encrypt(
      JSON.parse(session.refreshToken),
      {
        expiresIn: "1d",
      }
    );
    const refreshToken = await this.encrypter.encrypt(
      JSON.parse(session.refreshToken),
      {
        expiresIn: "7d",
      }
    );

    session.accessToken = accessToken;
    session.refreshToken = refreshToken;

    const sessionEntity = TypeOrmSessionMapper.toPersistence(session);

    const savedSession = await this.repository.save(sessionEntity);

    return TypeOrmSessionMapper.toDomain(savedSession);
  }
}
