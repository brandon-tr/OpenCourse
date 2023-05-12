/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  images: {
    domains: ["images.unsplash.com", "picsum.photos", "ui-avatars.com"],
  },
};

module.exports = nextConfig;
