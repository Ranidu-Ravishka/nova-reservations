/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "drive.google.com",
			},
		],
	},
	async rewrites() {
		const backendUrl =
			process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

		return [
			{
				source: "/api/:path*",
				destination: `${backendUrl}/api/:path*`,
			},
		];
	},
};

export default nextConfig;
