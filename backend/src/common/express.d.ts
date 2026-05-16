export type JwtUserPayload = { sub: string; discordId: string; role: "USER" | "ADMIN" | "INSTRUCTOR" };

declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}

export {};
