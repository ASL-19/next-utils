const { loadEnvConfig } = require("@next/env");

/**
 * Load .env.* into process.env using Next.js’ loadEnvConfig.
 *
 * @remarks
 * For dev/build/start loads .env.local; for tests loads .env.test.
 *
 * See https://nextjs.org/docs/basic-features/environment-variables
 */
const loadEnvFileIntoProcessEnv = () => {
  const silentConsole = {
    log: () => {},
    info: () => {},
    warn: () => {},
    error: () => {},
  };

  loadEnvConfig(process.cwd(), false, silentConsole);
};

export default loadEnvFileIntoProcessEnv;
