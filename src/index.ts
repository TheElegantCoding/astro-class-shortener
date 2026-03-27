import { processBuild } from '@src/util/process';

import type { OptionType } from '@src/type/option_type';
import type { AstroIntegration } from 'astro';

const classShortener = (options?: OptionType): AstroIntegration => ({
  name: 'class-shortener',
  hooks: {
    'astro:build:done': ({ dir: directory }) => { processBuild(directory, options); }
  }
});

export { classShortener };