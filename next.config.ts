import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Required for GitHub Pages
  images: {
    unoptimized: true, // Required if using the <Image /> component on static hosting
  },
  // If your repo is NOT 'yourusername.github.io' (e.g., it is 'finance-app')
  // un-comment the lines below:
  // basePath: '/finance-app',
  // assetPrefix: '/finance-app/',
};

export default nextConfig;
