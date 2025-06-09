import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "3001",
                pathname: "/api/uploads/**",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "3001",
                pathname: "/backend/assets/**",
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3001',
                pathname: '/assets/pdf/**',
            },
        ],
    },
};

export default nextConfig;
