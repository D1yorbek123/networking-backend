const nextConfig = {
	reactStrictMode: true,
	async rewrites() {
		return [
			{
				source: '/api/:path*',
				destination: 'http://34.229.59.215:5000/api/:path*',
			},
		]
	},
}

module.exports = nextConfig
