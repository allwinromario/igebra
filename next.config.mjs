/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  webpack: (config, { isServer }) => {
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

    // Handle Edge runtime packages
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        dns: false,
        tls: false,
        fs: false,
        path: false,
      };
    }

    return config;
  },
}

export default nextConfig 