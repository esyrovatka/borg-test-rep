/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: ["./src/shared/styles/"],
    prependData: `@import "helper.scss";`,
  },
  output: "export",
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgoConfig: {
              plugins: [
                {
                  name: "preset-default",
                  params: {
                    overrides: {
                      cleanupIds: false,
                      removeViewBox: false,
                    },
                  },
                },
                "removeXMLNS",
              ],
            },
          },
        },
      ],
    })
    return config
  },
}

module.exports = nextConfig
