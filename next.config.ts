import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Dev only: VS Code port forwarding / dev tunnels send the tunnel host as x-forwarded-host while the
      // browser's Origin stays localhost, which Next's CSRF check would reject (e.g. the admin sign-in form).
      // Production keeps the strict same-host check.
      allowedOrigins: isDev ? ["localhost:3000", "127.0.0.1:3000"] : [],
    },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
