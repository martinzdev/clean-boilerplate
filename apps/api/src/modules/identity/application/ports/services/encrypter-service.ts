import { UserPayload } from "@/modules/identity/infra/modules/auth/jwt.strategy";

export abstract class EncrypterService {
  abstract encrypt(
    payload: Record<string, unknown>,
    options?: { expiresIn: string }
  ): Promise<string>;

  abstract verify(token: string): Promise<UserPayload | null>;

  abstract decrypt(token: string): Promise<any>;
}
