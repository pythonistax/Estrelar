/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Enable static exports if needed for simple hosting
  // output: 'export',
  // Enable JSON imports
  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.json': ['.json'],
    }
    return config
  },
}

module.exports = nextConfig

