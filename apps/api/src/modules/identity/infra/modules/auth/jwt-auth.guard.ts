import { SessionRepository } from "@/modules/identity/application/ports/repositories/session.repository";
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { IS_PUBLIC_KEY } from "./public";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(
    private reflector: Reflector,
    private sessionRepository: SessionRepository
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new UnauthorizedException(new Error("No access token provided."));
    }

    const canActivate = super.canActivate(context);

    if (!canActivate) {
      return false;
    }

    try {
      const session = await this.sessionRepository.findOne({
        id: request.user.sub,
        isActive: true,
      });

      if (!session || session.accessToken !== token) {
        throw new UnauthorizedException(
          new Error("Session has been invalidated.")
        );
      }

      return true;
    } catch (error) {
      console.error("JwtAuthGuard - Error:", error);
      throw new UnauthorizedException(new Error("Invalid or expired session."));
    }
  }
}
