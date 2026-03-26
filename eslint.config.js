import eslintConfig from 'eslint-config-universal-code';

const config = eslintConfig({
  stylistic: true,
  typescript: true,
  unicorn: true,
  perfectionist: true,
  astro: true,
  json: true,
  yml: true,
});

export default config;