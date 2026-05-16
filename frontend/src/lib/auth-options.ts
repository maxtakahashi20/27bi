import type { AuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions: AuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: { params: { scope: "identify email guilds guilds.members.read" } },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.access_token) token.discordAccessToken = account.access_token;
      if (profile) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const p = profile as any;
        token.discordId = p.id;
        token.username = p.username;
        token.avatar = p.avatar ? `https://cdn.discordapp.com/avatars/${p.id}/${p.avatar}.png` : null;
      }
      return token;
    },
    async session({ session, token }) {
      session.discordAccessToken = token.discordAccessToken as string | undefined;
      session.discordId = token.discordId as string | undefined;
      session.username = token.username as string | undefined;
      session.avatar = token.avatar as string | null | undefined;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
