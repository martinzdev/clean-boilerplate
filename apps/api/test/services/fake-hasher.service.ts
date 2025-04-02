import { HasherService } from "@/modules/identity/application/ports/services/hasher-service";

export class FakeHasher implements HasherService {
  async hash(plaintext: string): Promise<string> {
    return plaintext.concat("-hashed");
  }

  async compare(plaintext: string, hash: string): Promise<boolean> {
    return plaintext.concat("-hashed") === hash;
  }
}
