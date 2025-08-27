const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: process.cwd(), // Edge-safe: no __dirname
});

module.exports = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "build/**",
      "eslint.config.cjs",
    ],
  },
  {
    rules: {
      // Temporarily disable the problematic rule
      "@typescript-eslint/no-unsafe-declaration-merging": "off",
    },
  },
];
