/** @type {import('next').NextConfig} */
const nextConfig = {
    devIndicators: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'assets.gowthamdev.com',
                port: '',
                pathname: '/images/**',
            },
        ],
    },
};

export default nextConfig;
