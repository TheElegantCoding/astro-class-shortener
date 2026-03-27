import fs from 'node:fs';
import selectorParser from 'postcss-selector-parser';

const DOM_RESERVED = [
  'scroll',
  'click',
  'DOMContentLoaded',
  'hashchange',
  'resize',
  'submit',
  'touchstart',
  'html',
  'body'
];

const transformCSSContent = (cssContent: string, classMap: Record<string, string>): string =>
  cssContent.replaceAll(/([^{}]+)({)/g, (_value, sel, brace) => selectorParser((selectors) => {
    selectors.walk((node) => {
      if ((node.type === 'class') && classMap[node.value]) {
        node.value = classMap[node.value] as string;
      }
    });
  }).processSync(sel as string) + brace);

const replaceInCSS = (filePath: string, classMap: Record<string, string>) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const newContent = content.replaceAll(/([^{}]+)({)/g, (_value, sel: string, brace) => selectorParser((selectors) => {
    selectors.walk((node) => {
      const originalValue = node.value as string;
      if ((node.type === 'class') && classMap[originalValue]) {
        node.value = classMap[originalValue];
      }
    });
  })
    .processSync(sel) + brace);
  fs.writeFileSync(filePath, newContent);
};

const replaceInHTML = (filePath: string, classMap: Record<string, string>) => {
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replaceAll(/(<style[^>]*>)([\S\s]*?)(<\/style>)/gi, (
    _value,
    open,
    css,
    close
  ) => open + transformCSSContent(css as string, classMap) + close);

  const sortedKeys = Object.keys(classMap).toSorted((first, second) => second.length - first.length);
  sortedKeys.forEach((longName) => {
    const shortName = classMap[longName] as string;

    const classAttributeRegex = new RegExp(String.raw`(?<=class=["']|\s|\.)\b${longName}\b(?=["'\s])`, 'g');
    content = content.replace(classAttributeRegex, shortName);
  });

  fs.writeFileSync(filePath, content);
};

const replaceInJS = (content: string, classMap: Record<string, string>) => {
  let updatedContent = content;

  Object.entries(classMap).forEach(([original, short]) => {
    if (DOM_RESERVED.includes(original)) { return; }

    const regex = new RegExp(String.raw`(?<=['".])\b${original}\b(?=['" ])`, 'g');
    updatedContent = updatedContent.replace(regex, short);
  });

  return updatedContent;
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

export {
  replaceInJS,
  replaceInCSS,
  replaceInHTML,
  replaceClassesAndWriteMap
};
