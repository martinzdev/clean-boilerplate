import { DatabaseModule } from "@/infra/database/database.module";
import { Module } from "@nestjs/common";
import { AuthenticateUserUseCase } from "../../application/use-cases/authenticate-user";
import { ReauthenticateUserUserCase } from "../../application/use-cases/reauthenticate-user";
import { RegisterUserUseCase } from "../../application/use-cases/register-user";
import { CryptographyModule } from "../services/cryptography/cryptography.module";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { ReauthenticateUserController } from "./controllers/reauthenticate.controller";
import { RegisterUserController } from "./controllers/register-user.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateController,
    RegisterUserController,
    ReauthenticateUserController,
  ],
  providers: [
    RegisterUserUseCase,
    AuthenticateUserUseCase,
    ReauthenticateUserUserCase,
  ],
})
export class HttpModule {}
