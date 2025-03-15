import { Either, left, right } from "@/@shared/core/either";
import { WrongCredentialsException } from "../exceptions/WrongCredentialsException";
import { UserRepository } from "../ports/repositories/user.repository";
import { EncrypterService } from "../ports/services/encrypter-service";
import { HasherService } from "../ports/services/hasher-service";

export type AuthenticateUserUseCaseRequest = {
  name: string;
  email: string;
  password: string;
};

export type AuthenticateUserUseCaseResponse = Either<
  WrongCredentialsException,
  {
    accessToken: string;
  }
>;

export class AuthenticateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HasherService,
    private readonly encrypterService: EncrypterService
  ) {}
  async execute({
    name,
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

    const accessToken = await this.encrypterService.encrypt({
      sub: user.id.toString(),
    });

    return right({
      accessToken,
    });
  }
}
