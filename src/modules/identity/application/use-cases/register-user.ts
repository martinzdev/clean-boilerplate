import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { User } from "../../domain/entities/user";
import { UserAlreadyExistsException } from "../exceptions/UserAlreadyExistsException";
import { UserRepository } from "../ports/repositories/user.repository";
import { HasherService } from "../ports/services/hasher-service";

export type RegisterUserUseCaseRequest = {
  name: string;
  email: string;
  password: string;
};

export type RegisterUserUseCaseResponse = Either<
  UserAlreadyExistsException,
  {
    user: User;
  }
>;

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HasherService
  ) {}
  async execute({
    name,
    email,
    password,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const userWithSameEmail = await this.userRepository.exists({ email });

    if (userWithSameEmail) {
      return left(new UserAlreadyExistsException(email));
    }

    const hashedPassword = await this.hashService.hash(password);

    const user = User.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    return right({
      user,
    });
  }
}
