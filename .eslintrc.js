// @ts-expect-error (doesn’t need typing)
require("@rushstack/eslint-patch/modern-module-resolution");

const eslintConfig = {
  extends: [
    "@asl-19/eslint-config",
    "@asl-19/eslint-config/react",
    "@asl-19/eslint-config/typescript",
  ],
  plugins: ["sort-keys-fix"],
  rules: {
    "no-restricted-imports": "off",
    "sort-keys-fix/sort-keys-fix": [
      "warn",
      "asc",
      {
        caseSensitive: false,
        natural: true,
      },
    ],
  },
};

module.exports = eslintConfig;
