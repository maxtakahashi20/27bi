/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.discordapp.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  /** Pastas sincronizadas (OneDrive/Downloads) no Windows costumam perder eventos do watcher → chunks 404 no dev */
  webpack: (config, { dev }) => {
    if (dev) {
      /** Evita PackFileCacheStrategy / chunks numéricos (ex.: 638.js) órfãos no Windows + Downloads */
      config.cache = false;
      config.watchOptions = {
        ...config.watchOptions,
        poll: 1500,
        aggregateTimeout: 300,
        ignored: ["**/node_modules/**", "**/.git/**"],
      };
    }
    return config;
  },
};
