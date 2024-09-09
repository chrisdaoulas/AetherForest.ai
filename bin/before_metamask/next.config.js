/** @type {import('next').NextConfig} */


const nextConfig = {  webpack: (config, { isServer }) => {
   config.resolve.alias.canvas = false;

   config.module.rules.push({
    test: /\.html$/,
    use: 'html-loader',
  });

  if (!isServer) {
    // Exclude specific files from being processed by Webpack
    config.module.rules.push({
      test: /\.(cs)$/,
      use: 'ignore-loader',
    });
  }

   return config;
 },
 env: {
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY
}  
};

module.exports = nextConfig;


