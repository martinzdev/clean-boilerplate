import { UniqueEntityID } from "@/@shared/core/entities/unique-entity-id";
import { Session } from "@/modules/identity/domain/entities/session";
import { FakeEncrypter } from "test/services/fake-encrypter.service";

type MakeSessionOptions = {
  userId?: string;
  expiresIn?: number;
};

export async function makeSession(options: MakeSessionOptions = {}) {
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

  const accessToken = await encrypter.encrypt(accessTokenPayload);
  const refreshToken = await encrypter.encrypt(refreshTokenPayload);

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
