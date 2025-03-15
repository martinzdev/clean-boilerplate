import { EncrypterService } from "@/modules/identity/application/ports/services/encrypter-service";
import { Injectable } from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { UserPayload } from "../../modules/auth/jwt.strategy";

@Injectable()
export class JwtEncrypterService implements EncrypterService {
  constructor(private jwtService: JwtService) {}

  encrypt(
    payload: Record<string, unknown>,
    options?: JwtSignOptions
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: "1d",
      ...options,
    });
  }

  async verify(token: string): Promise<UserPayload | null> {
    return this.jwtService.verifyAsync(token) as Promise<UserPayload | null>;
  }

  async decrypt(token: string): Promise<any> {
    return this.jwtService.decode(token);
  }
}
