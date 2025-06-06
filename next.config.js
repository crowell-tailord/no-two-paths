/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'www.tokyorebels.io',
            'cdn.midjourney.com',
            'localhost'
        ],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.midjourney.com',
                port: ''
                // http://localhost:3000/_next/image?url=https%3A%2F%2Fcdn.midjourney.com%2Fdd11512f-48fb-419d-ae35-05a8381e6b6f%2F0_0.png&w=1920&q=60
            }
        ]
    }
}

module.exports = nextConfig
