import fs from 'node:fs';
import path from 'node:path';

const findAllFiles = (extension: string, directory = 'public') => {
  const filesPath = directory;
  const resultFiles = fs.readdirSync(filesPath, { recursive: true });
  const filterFiles = resultFiles.filter((element) => element.includes(extension.toLowerCase()));
  const result = filterFiles.map((element) => path.join(directory, element.toString()));

  return result;
};

const getFilesByExtension = (distributionPath: string) => {
  const cssFiles = findAllFiles('.css', distributionPath);
  const htmlFiles = findAllFiles('.html', distributionPath);
  const jsFiles = findAllFiles('.js', distributionPath).filter((file) => !file.includes('~partytown'));
  return { cssFiles, htmlFiles, jsFiles };
};

export { findAllFiles, getFilesByExtension };