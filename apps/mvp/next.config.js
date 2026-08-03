const path = require("path");

const discoveryDataIncludes = [
  "data/discovery/**/*",
  "data/research/**/*",
  "apps/mvp/data/discovery/**/*",
  "apps/mvp/data/research/**/*",
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@blinkit/discovery-core"],
  // Include monorepo root so data/discovery JSON is traced in serverless bundles
  outputFileTracingRoot: path.join(__dirname, "../.."),
  outputFileTracingIncludes: {
    "/playground": discoveryDataIncludes,
    "/discovery/part1": discoveryDataIncludes,
    "/discovery/part3": discoveryDataIncludes,
    "/dashboard/discovery": discoveryDataIncludes,
    "/api/discovery": discoveryDataIncludes,
    "/api/research/questions": discoveryDataIncludes,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

module.exports = nextConfig;
