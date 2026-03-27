import { createClassMap } from '@src/util/class_map';
import { getFilesByExtension } from '@src/util/file';
import { replaceClassesAndWriteMap } from '@src/util/replace_classes';
import { scanForSelectors } from '@src/util/scan_classes';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { OptionType } from '@src/type/option_type';

const processSelectors = (cssFiles: string[], htmlFiles: string[], jsFiles: string[]) => {
  const allSelectors = new Set<string>();
  scanForSelectors([
    ...cssFiles,
    ...htmlFiles,
    ...jsFiles
  ], allSelectors);
  return allSelectors;
};

const processBuild = (directory: URL, options?: OptionType) => {
  const distributionPath = fileURLToPath(directory);
  const jsonPath = path.join(distributionPath, 'class_map.json');
  const { cssFiles, htmlFiles, jsFiles } = getFilesByExtension(distributionPath);
  const allSelectors = processSelectors(cssFiles, htmlFiles, jsFiles);

  if (options?.exclude) {
    options.exclude.forEach((selector) => allSelectors.delete(selector));
  }

  const classMap = createClassMap([...allSelectors]);

  replaceClassesAndWriteMap(
    cssFiles,
    htmlFiles,
    jsFiles,
    classMap,
    jsonPath
  );
};

export { processBuild };