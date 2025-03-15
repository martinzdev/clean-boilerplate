export abstract class EncrypterService {
  abstract encrypt(payload: Record<string, unknown>): Promise<string>;
}
