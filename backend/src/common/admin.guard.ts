import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwt: JwtService) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const auth = req.headers["authorization"] as string | undefined;
    if (!auth?.startsWith("Bearer ")) throw new UnauthorizedException("Sem token");
    try {
      const payload = await this.jwt.verifyAsync(auth.slice(7), { secret: process.env.JWT_SECRET });
      if (payload.role !== "ADMIN" && payload.role !== "INSTRUCTOR") throw new UnauthorizedException("Sem permissão");
      req.user = {
        sub: payload.sub,
        discordId: payload.discordId,
        role: payload.role,
      };
      return true;
    } catch {
      throw new UnauthorizedException("Token inválido");
    }
  }
}
