/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "drive.google.com",
			},
			{
				protocol: "https",
				hostname: "dynamic-media-cdn.tripadvisor.com",
			},
			{
				protocol: "https",
				hostname: "**.cloudfront.net",
			},
			{
				protocol: "https",
				hostname: "movenpickresortcamranh.com",
			},
			{
				protocol: "https",
				hostname: "img.freepik.com",
			},
		],
	},
};

export default nextConfig;
