const nextConfig = {
	reactStrictMode: true,
	async rewrites() {
		const apiInternalUrl = process.env.API_INTERNAL_URL || 'http://localhost:5000'

		return [
			{
				source: '/api/:path*',
				destination: `${apiInternalUrl}/api/:path*`,
			},
		]
	},
}

module.exports = nextConfig
