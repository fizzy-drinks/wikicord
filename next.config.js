/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: { domains: ["cdn.discordapp.com"] },
  serverRuntimeConfig: {
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      redirectUri: process.env.DISCORD_AUTH_REDIRECT,
    },
    mongodb: {
      uri: process.env.MONGODB_URI,
      db: process.env.MONGODB_DATABASE,
    },
  },
};

module.exports = nextConfig;
