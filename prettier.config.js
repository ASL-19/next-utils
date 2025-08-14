/** @type {import("prettier").Config} */
const prettierConfig = {
  // eslint-disable-next-line sort-keys-fix/sort-keys-fix
  overrides: [
    {
      files: ["*.json"],
      options: {
        // Prevent consolidating multiple values on one line
        printWidth: 1,
      },
    },
  ],
};

export default prettierConfig;
