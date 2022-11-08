/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      redirectUri: process.env.DISCORD_AUTH_REDIRECT,
    },
  },
};

module.exports = nextConfig;
