/** @type {import('next').NextConfig} */


const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,

    webpack: (config) => {
        config.watchOptions = {
            poll: 5000,
            aggregateTimeout: 100
        }
        return config
    }
}
module.exports = nextConfig