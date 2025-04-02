import { UseCaseException } from "@/core/exceptions/use-case-exception";

export class UserNotFoundException extends UseCaseException {
  constructor() {
    super("User not found.");
  }
}
