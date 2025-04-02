import { UseCaseException } from "@/@shared/core/exceptions/use-case-exception";

export class WrongCredentialsException extends UseCaseException {
  constructor() {
    super("Wrong credentials.");
  }
}
