/** @type {import('next').NextConfig} */


const nextConfig = {
    experimental: {
        serverActions: true
    },
    reactStrictMode: true,
    swcMinify: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'i.scdn.co',
                port: '',
                pathname: '/image/**',
            },
        ]
    },
    webpack: (config) => {
        config.externals.push({
            'utf-8-validate': 'commonjs utf-8-validate',
            'bufferutil': 'commonjs bufferutil',
        })
        config.watchOptions = {
            poll: 5000,
            aggregateTimeout: 100
        }
        return config
    }
}
module.exports = nextConfig