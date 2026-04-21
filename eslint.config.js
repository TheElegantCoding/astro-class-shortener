/* eslint-disable ts/no-unsafe-call */
import eslintConfig from 'eslint-config-universal-code';

const config = eslintConfig({
  stylistic: true,
  typescript: true,
  unicorn: true,
  perfectionist: true,
  json: true,
  yml: true
}, {
  rules: {
    'no-param-reassign': 'off',
    'ts/no-dynamic-delete': 'off'
  }
});

export default config;