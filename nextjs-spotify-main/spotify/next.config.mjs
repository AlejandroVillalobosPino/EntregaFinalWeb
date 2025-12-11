/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'i.scdn.co',
            },
        ],
    },
    // Asegurar que se usa el output estándar
    output: 'standalone',
};

export default nextConfig;