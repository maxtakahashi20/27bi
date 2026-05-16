import "next-auth";

declare module "next-auth" {
  interface Session {
    discordAccessToken?: string;
    discordId?: string;
    username?: string;
    avatar?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    discordAccessToken?: string;
    discordId?: string;
    username?: string;
    avatar?: string | null;
  }
}
