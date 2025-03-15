import { UseCaseException } from "@/@shared/core/exceptions/use-case-exception";

export class UserAlreadyExistsException extends UseCaseException {
  constructor(identifier: string) {
    super(`User "${identifier}" already exists.`);
  }
}
