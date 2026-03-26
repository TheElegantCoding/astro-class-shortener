/* eslint-disable ts/strict-boolean-expressions */
/* eslint-disable ts/non-nullable-type-assertion-style */
/* eslint-disable no-param-reassign */
import fs from 'node:fs';
import selectorParser from 'postcss-selector-parser';

const replaceInCSS = (filePath: string, classMap: Record<string, string>) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const newContent = content.replaceAll(/([^{}]+)({)/g, (_value, sel: string, brace) => selectorParser((selectors) => {
    selectors.walk((node) => {
      const originalValue = node.value as string;
      if ((node.type === 'class' || node.type === 'id') && classMap[originalValue]) {
        node.value = classMap[originalValue];
      }
    });
  })
    .processSync(sel) + brace);
  fs.writeFileSync(filePath, newContent);
};

const replaceInHTML = (filePath: string, classMap: Record<string, string>) => {
  let content = fs.readFileSync(filePath, 'utf8');
  const sortedKeys = Object.keys(classMap).toSorted((first, second) => second.length - first.length);

  sortedKeys.forEach((longName) => {
    const shortName = classMap[longName];
    const regex = new RegExp(String.raw`(["'\s\.])(${longName})(["'\s])`, 'g');
    content = content.replace(regex, `$1${shortName}$3`);
  });

  fs.writeFileSync(filePath, content);
};

export {
  replaceInCSS,
  replaceInHTML
};