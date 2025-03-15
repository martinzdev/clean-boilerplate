import { UseCaseException } from "@/@shared/core/exceptions/use-case-exception";

export class AuthenticateInvalidTokenException extends UseCaseException {
  constructor() {
    super("Authenticate invalid token.");
  }
}
