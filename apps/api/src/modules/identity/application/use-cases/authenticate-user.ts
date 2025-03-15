import { Either, left, right } from "@/@shared/core/either";
import { Injectable } from "@nestjs/common";
import { Session } from "../../domain/entities/session";
import { WrongCredentialsException } from "../exceptions/WrongCredentialsException";
import { SessionRepository } from "../ports/repositories/session.repository";
import { UserRepository } from "../ports/repositories/user.repository";
import { EncrypterService } from "../ports/services/encrypter-service";
import { HasherService } from "../ports/services/hasher-service";

export type AuthenticateUserUseCaseRequest = {
  email: string;
  password: string;
};

export type AuthenticateUserUseCaseResponse = Either<
  WrongCredentialsException,
  {
    accessToken: string;
    refreshToken: string;
  }
>;

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly hashService: HasherService,
    private readonly encrypterService: EncrypterService
  ) {}
  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.userRepository.findOne({ email });

    if (!user) {
      return left(new WrongCredentialsException());
    }

    const isPasswordCorrect = await this.hashService.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return left(new WrongCredentialsException());
    }

    const accessToken = await this.encrypterService.encrypt(
      {
        sub: user.id.toString(),
      },
      { expiresIn: "1h" }
    );

    const refreshTokenExpiresIn =
      new Date().getTime() + 3 * 24 * 60 * 60 * 1000; // 3 days

    const refreshToken = await this.encrypterService.encrypt(
      {
        sub: user.id.toString(),
        type: "refresh",
        email: user.email,
        name: user.name,
      },
      { expiresIn: "7d" }
    );

    const refreshTokenExist = await this.sessionRepository.findOne({
      userId: user.id.toString(),
    });

    if (refreshTokenExist) {
      await this.sessionRepository.save(
        Session.create(
          {
            userId: user.id.toString(),
            accessToken: refreshTokenExist.accessToken,
            refreshToken: refreshTokenExist.refreshToken,
            isActive: false,
            expiresAt: new Date(refreshTokenExpiresIn),
          },
          refreshTokenExist.id
        )
      );
    }

    await this.sessionRepository.save(
      Session.create({
        userId: user.id.toString(),
        accessToken: accessToken,
        refreshToken: refreshToken,
        isActive: true,
        expiresAt: new Date(refreshTokenExpiresIn),
      })
    );

    return right({
      accessToken,
      refreshToken,
    });
  }
}
