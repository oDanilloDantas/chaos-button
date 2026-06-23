import next from "eslint-config-next";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      ".open-next/**",
      ".wrangler/**",
      "coverage/**",
      "node_modules/**",
    ],
  },
  ...next,
];

export default eslintConfig;
