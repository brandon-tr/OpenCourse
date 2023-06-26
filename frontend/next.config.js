/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: false,
  images: {
    domains: ["images.unsplash.com", "picsum.photos", "ui-avatars.com"],
  },
};

module.exports = nextConfig;
