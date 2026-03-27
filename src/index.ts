import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createClassMap } from './util/class_map';
import { findAllFiles } from './util/file';
import { replaceInJS, replaceInCSS, replaceInHTML } from './util/replace_classes';
import { scanForSelectors } from './util/scan_classes';

import type { AstroIntegration } from 'astro';

const getFilesByExtension = (distributionPath: string) => {
  const cssFiles = findAllFiles('.css', distributionPath);
  const htmlFiles = findAllFiles('.html', distributionPath);
  const jsFiles = findAllFiles('.js', distributionPath);
  return { cssFiles, htmlFiles, jsFiles };
};

const processSelectors = (cssFiles: string[], htmlFiles: string[], jsFiles: string[]) => {
  const allSelectors = new Set<string>();
  scanForSelectors([
    ...cssFiles,
    ...htmlFiles,
    ...jsFiles
  ], allSelectors);
  return allSelectors;
};

const replaceClassesAndWriteMap = (
  cssFiles: string[],
  htmlFiles: string[],
  jsFiles: string[],
  classMap: Record<string, string>,
  jsonPath: string
) => {
  cssFiles.forEach((file) => { replaceInCSS(file, classMap); });
  htmlFiles.forEach((file) => { replaceInHTML(file, classMap); });
  jsFiles.forEach((file) => { replaceInJS(file, classMap); });
  fs.writeFileSync(jsonPath, JSON.stringify(classMap, null, 2));
};

const processBuild = (directory: URL) => {
  const distributionPath = fileURLToPath(directory);
  const jsonPath = path.join(distributionPath, 'class_map.json');
  const { cssFiles, htmlFiles, jsFiles } = getFilesByExtension(distributionPath);
  const allSelectors = processSelectors(cssFiles, htmlFiles, jsFiles);
  const classMap = createClassMap([...allSelectors]);

  replaceClassesAndWriteMap(
    cssFiles,
    htmlFiles,
    jsFiles,
    classMap,
    jsonPath
  );
};

const classShortener = (): AstroIntegration => ({
  name: 'class-shortener',
  hooks: {
    'astro:build:done': ({ dir: directory }) => {
      processBuild(directory);
    }
  }
});

export { classShortener };