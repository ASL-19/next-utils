require("@rushstack/eslint-patch/modern-module-resolution");

const eslintConfig = {
  extends: ["@asl-19/eslint-config", "@asl-19/eslint-config/react"],
  rules: {
    "no-restricted-imports": "off",
  },
};

// eslint-disable-next-line functional/immutable-data
module.exports = eslintConfig;
