import { EncrypterService } from "@/modules/identity/application/ports/services/encrypter-service";

export class FakeEncrypter implements EncrypterService {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload);
  }
}
