import { getFilesByExtension } from '@src/util/file';
import { replaceClasses } from '@src/util/replace_classes';
import { fileURLToPath } from 'node:url';

import type { OptionType } from '@src/type/option_type';
import type { AstroIntegration } from 'astro';

const classShortener = (options?: OptionType): AstroIntegration => ({
  name: 'class-shortener',
  hooks: {
    'astro:build:done': ({ dir: directory }) => {
      const distributionPath = fileURLToPath(directory);
      const { cssFiles, htmlFiles, jsFiles } = getFilesByExtension(distributionPath);
      const cssJsonMap: Record<string, string> = {};

      replaceClasses({
        cssFiles,
        htmlFiles,
        jsFiles,
        cssJsonMap,
        excludedClasses: options?.exclude ?? [],
        distributionPath
      });
    }
  }
});

export { classShortener };