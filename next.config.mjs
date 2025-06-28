/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  webpack: (config) => {
    // Ensure config.module exists
    if (!config.module) {
      config.module = {
        rules: [],
      };
    }

    // Ensure config.module.rules exists
    if (!config.module.rules) {
      config.module.rules = [];
    }

    config.module.rules.push({
      test: /katex\.min\.css$/,
      use: ['style-loader', 'css-loader'],
    });

    return config;
  },
}

export default nextConfig 