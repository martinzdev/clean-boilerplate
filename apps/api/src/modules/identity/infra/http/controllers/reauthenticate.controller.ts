import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { AuthenticateInvalidTokenException } from "@/modules/identity/application/exceptions/AuthenticateInvalidTokenException";
import { UserNotFoundException } from "@/modules/identity/application/exceptions/UserNotFoundException";
import { ReauthenticateUserUserCase } from "@/modules/identity/application/use-cases/reauthenticate-user";
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { zodToOpenAPI } from "nestjs-zod";
import { z } from "zod";
import { Public } from "../../modules/auth/public";

const reauthenticateUserBodySchema = z.object({
  refreshToken: z.string().jwt(),
});

type ReauthenticateUserBodySchema = z.infer<
  typeof reauthenticateUserBodySchema
>;

@Controller("/auth")
@ApiTags("auth")
@Public()
export class ReauthenticateUserController {
  constructor(
    private readonly reauthenticateUserUseCase: ReauthenticateUserUserCase
  ) {}

  @Post("/refresh")
  @HttpCode(201)
  @ApiBody({ schema: zodToOpenAPI(reauthenticateUserBodySchema) })
  @UsePipes(new ZodValidationPipe(reauthenticateUserBodySchema))
  async handle(@Body() body: ReauthenticateUserBodySchema) {
    const { refreshToken } = body;

    const result = await this.reauthenticateUserUseCase.execute({
      refreshToken,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case AuthenticateInvalidTokenException:
          throw new UnauthorizedException(error.message);
        case UserNotFoundException:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return result.value;
  }
}
