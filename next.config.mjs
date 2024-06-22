/** @type {import('next').NextConfig} */

const nextConfig = {
    async redirects() {
        return [{
            source: "/",
            destination: "/convos",
            permanent: true
        }]
    }
};

export default nextConfig;
