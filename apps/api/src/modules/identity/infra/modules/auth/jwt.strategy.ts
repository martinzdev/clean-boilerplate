import { EnvService } from "@/infra/env/env.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { z } from "zod";

const tokenPayloadSchema = z.object({
  sub: z.string().uuid(),
  type: z.enum(["access", "refresh"]),
});

export type UserPayload = z.infer<typeof tokenPayloadSchema>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(env: EnvService) {
    const publicKey = env.get("JWT_PUBLIC_KEY");

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, "base64"),
      algorithms: ["RS256"],
    });
  }

  async validate(payload: UserPayload) {
    const validatedPayload = tokenPayloadSchema.parse(payload);

    if (validatedPayload.type !== "access") {
      throw new UnauthorizedException("Invalid token type");
    }

    try {
      // Criar uma nova instância da classe UserPayload
      const userPayload = {
        sub: validatedPayload.sub,
        type: validatedPayload.type,
      };

      return userPayload;
    } catch (error) {
      console.error("JWT Strategy - Validation error:", error);
      throw new UnauthorizedException("Invalid token payload");
    }
  }
}
