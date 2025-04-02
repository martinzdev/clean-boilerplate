import { UseCaseException } from "../use-case-exception";

export class NotAllowedError extends UseCaseException {
  constructor() {
    super("Not allowed.");
  }
}
