import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Injectable } from "@nestjs/common";
import { Session } from "../../domain/entities/session";
import { AuthenticateInvalidTokenException } from "../exceptions/AuthenticateInvalidTokenException";
import { UserNotFoundException } from "../exceptions/UserNotFoundException";
import { SessionRepository } from "../ports/repositories/session.repository";
import { UserRepository } from "../ports/repositories/user.repository";
import { EncrypterService } from "../ports/services/encrypter-service";

type ReauthenticateUserUserCaseRequest = {
  refreshToken: string;
};

type ReauthenticateUserUserCaseResponse = Either<
  AuthenticateInvalidTokenException | UserNotFoundException,
  {
    accessToken: string;
    refreshToken: string;
  }
>;

@Injectable()
export class ReauthenticateUserUserCase {
  constructor(
    private userRepository: UserRepository,
    private sessionRepository: SessionRepository,
    private encrypterService: EncrypterService
  ) {}

  async execute({
    refreshToken,
  }: ReauthenticateUserUserCaseRequest): Promise<ReauthenticateUserUserCaseResponse> {
    const payload = await this.encrypterService.verify(refreshToken);

    if (!payload || payload.type !== "refresh") {
      return left(new AuthenticateInvalidTokenException());
    }

    const user = await this.userRepository.findOne({
      id: new UniqueEntityID(payload.sub),
    });

    if (!user) {
      return left(new UserNotFoundException());
    }

    const existingSession = await this.sessionRepository.findOne({
      refreshToken,
    });

    if (
      !existingSession ||
      !existingSession.isActive ||
      existingSession.isExpired()
    ) {
      return left(new AuthenticateInvalidTokenException());
    }

    existingSession.isActive = false;
    await this.sessionRepository.save(existingSession);

    const accessToken = await this.encrypterService.encrypt(
      {
        sub: payload.sub,
        type: "access",
        email: user.email,
        name: user.name,
      },
      { expiresIn: "1h" }
    );

    const refreshTokenExpiresIn =
      new Date().getTime() + 7 * 24 * 60 * 60 * 1000; // 7 days

    const newRefreshToken = await this.encrypterService.encrypt(
      {
        sub: payload.sub,
        type: "refresh",
        email: user.email,
        name: user.name,
      },
      { expiresIn: "7d" }
    );

    await this.sessionRepository.save(
      Session.create({
        userId: payload.sub,
        accessToken: accessToken,
        refreshToken: newRefreshToken,
        isActive: true,
        expiresAt: new Date(refreshTokenExpiresIn),
      })
    );

    return right({
      accessToken,
      refreshToken: newRefreshToken,
    });
  }
}
