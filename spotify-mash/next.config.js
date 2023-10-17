/** @type {import('next').NextConfig} */


const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
    images: {
        domains: ['i.scdn.co'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
                port: '',
                pathname: '**',
            },
        ]
    },
    webpack: (config) => {
        config.watchOptions = {
            poll: 5000,
            aggregateTimeout: 100
        }
        return config
    }
}
module.exports = nextConfig