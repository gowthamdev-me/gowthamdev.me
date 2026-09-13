/** @type {import('next').NextConfig} */
const nextConfig = {
    devIndicators: false,
    compress: true,
    experimental: {
        optimizePackageImports: [
            "lucide-react",
            "motion",
            "dayjs",
            "@dnd-kit/core",
            "@dnd-kit/sortable",
        ],
    },
    images: {
        formats: ["image/avif", "image/webp"],
        minimumCacheTTL: 31536000,
        remotePatterns: [
            {
                protocol: "https",
                hostname: "assets.gowthamdev.me",
                port: "",
                pathname: "/images/**",
            },
            {
                protocol: "https",
                hostname: "raw.githubusercontent.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
                pathname: "/**",
            },
        ],
    },
    async headers() {
        return [
            {
                source: "/:all*(svg|jpg|png|webp|avif|otf|woff2)",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
        ];
    },
    async redirects() {
        return [
            { source: "/projects", destination: "/#projects", permanent: false },
            { source: "/about", destination: "/#about", permanent: false },
            { source: "/experiences", destination: "/#experiences", permanent: false },
            { source: "/experience", destination: "/#experiences", permanent: false },
            { source: "/work", destination: "/#projects", permanent: false },
        ];
    },
    async rewrites() {
        return [
            { source: "/about.md", destination: "/about-md" },
            { source: "/awards.md", destination: "/awards-md" },
            { source: "/certifications.md", destination: "/certifications-md" },
            { source: "/experience.md", destination: "/experience-md" },
            { source: "/projects.md", destination: "/projects-md" },
            { source: "/llms.txt", destination: "/llms-txt" },
            { source: "/blog.mdx/:slug", destination: "/blog-mdx/:slug" },
        ];
    },
};

export default nextConfig;
