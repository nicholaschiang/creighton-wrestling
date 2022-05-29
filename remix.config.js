/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  devServerPort: 8002,
  cacheDirectory: './node_modules/.cache/remix',
  ignoredRouteFiles: ['.*', '**/*.css', '**/*.test.{js,jsx,ts,tsx}'],
};
