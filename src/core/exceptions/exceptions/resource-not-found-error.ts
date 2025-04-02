import { UseCaseException } from "../use-case-exception";

export class ResourceNotFoundError extends UseCaseException {
  constructor() {
    super("Resource not found.");
  }
}
