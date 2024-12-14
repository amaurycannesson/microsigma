/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
              source: '/',
              destination: '/declaration',
              permanent: true,
            },
          ]
    }
}

module.exports = nextConfig
