import { DatabaseModule } from "@/infra/database/database.module";
import { Module } from "@nestjs/common";
import { AuthenticateUserUseCase } from "../../application/use-cases/authenticate-user";
import { RegisterUserUseCase } from "../../application/use-cases/register-user";
import { CryptographyModule } from "../services/cryptography/cryptography.module";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { RegisterUserController } from "./controllers/register-user.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [AuthenticateController, RegisterUserController],
  providers: [RegisterUserUseCase, AuthenticateUserUseCase],
})
export class HttpModule {}
