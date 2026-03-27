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
      if ((node.type === 'class' || node.type === 'id') && classMap[node.value]) {
        node.value = classMap[node.value] as string;
      }
    });
  }).processSync(sel as string) + brace);

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

  content = content.replaceAll(/(<style[^>]*>)([\S\s]*?)(<\/style>)/gi, (
    _value,
    open,
    css,
    close
  ) => open + transformCSSContent(css as string, classMap) + close);

  const sortedKeys = Object.keys(classMap).toSorted((first, second) => second.length - first.length);
  sortedKeys.forEach((longName) => {
    const shortName = classMap[longName];
    const regex = new RegExp(String.raw`(["'\s\.])(${longName})(["'\s])`, 'g');
    content = content.replace(regex, `$1${shortName}$3`);
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

export {
  replaceInJS,
  replaceInCSS,
  replaceInHTML
};
