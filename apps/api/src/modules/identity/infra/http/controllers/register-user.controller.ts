import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { UserAlreadyExistsException } from "@/modules/identity/application/exceptions/UserAlreadyExistsException";
import { RegisterUserUseCase } from "@/modules/identity/application/use-cases/register-user";
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from "@nestjs/common";
import { z } from "zod";
import { Public } from "../../modules/auth/public";

const registerUserBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type RegisterUserBodySchema = z.infer<typeof registerUserBodySchema>;

@Controller("/auth")
@Public()
export class RegisterUserController {
  constructor(private registerUser: RegisterUserUseCase) {}

  @Post("signup")
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(registerUserBodySchema))
  async handle(@Body() body: RegisterUserBodySchema) {
    const { name, email, password } = body;

    const result = await this.registerUser.execute({
      name,
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UserAlreadyExistsException:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
