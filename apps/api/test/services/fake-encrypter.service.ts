import { EncrypterService } from "@/modules/identity/application/ports/services/encrypter-service";
import { UserPayload } from "@/modules/identity/infra/modules/auth/jwt.strategy";

export class FakeEncrypter implements EncrypterService {
  private readonly validTokens: Map<string, Record<string, unknown>> =
    new Map();

  async verify(token: string): Promise<UserPayload | null> {
    try {
      const decoded = await this.decrypt(token);

      if (
        typeof decoded === "object" &&
        decoded !== null &&
        "sub" in decoded &&
        "type" in decoded &&
        typeof decoded.sub === "string" &&
        (decoded.type === "access" || decoded.type === "refresh")
      ) {
        return decoded as UserPayload;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  async decrypt(token: string): Promise<any> {
    try {
      if (this.validTokens.has(token)) {
        return this.validTokens.get(token);
      }

      const decoded = JSON.parse(token);
      return decoded;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  async encrypt(payload: Record<string, unknown>): Promise<string> {
    const token = JSON.stringify(payload);
    this.validTokens.set(token, payload);
    return token;
  }
}
