/* eslint-disable ts/no-dynamic-delete */
/* eslint-disable no-param-reassign */
import { processJSContent } from '@src/util/process';
import { generateShortName } from '@src/util/shortener';
import { parse } from 'node-html-parser';
import fs from 'node:fs';
import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';

import type { ReplaceClassType } from '@src/type/replace_class_type';

const replaceCss = (cssFile: postcss.Root, cssJsonMap: Record<string, string>) => {
  let globalIndex = 0;

  cssFile.walkRules((rule) => {
    const selector = selectorParser((selectors) => {
      selectors.walk((node) => {
        if (node.type === 'class') {
          const originalName = node.value;

          if (!cssJsonMap[originalName]) {
            cssJsonMap[originalName] = generateShortName(globalIndex);
            globalIndex++;
          }

          node.value = cssJsonMap[originalName];
        }
      });
    }).processSync(rule.selector);
    rule.selector = selector;
  });
};

const replaceHtml = (htmlContent: string, cssJsonMap: Record<string, string>): string => {
  const root = parse(htmlContent);
  const elements = root.querySelectorAll('*');
  const scripts = root.querySelectorAll('script');

  elements.forEach((element) => {
    const attributeNames = element.attributes;

    Object.keys(attributeNames).forEach((item) => {
      if (item === 'class') {
        const classAttribute = attributeNames[item];
        if (classAttribute) {
          const classNames = classAttribute.split(/\s+/);
          element.setAttribute('class', classNames.map((name) => cssJsonMap[name] ?? name).join(' '));
        }
      }

      if (item.startsWith('data-')) {
        const attributeValue = attributeNames[item];
        if (attributeValue) {
          const names = attributeValue.split(/\s+/);
          element.setAttribute(item, names.map((name) => cssJsonMap[name] ?? name).join(' '));
        }
      }
    });
  });

  scripts.forEach((node) => {
    const isPartyTown = node.innerHTML.includes('partytown');
    if (isPartyTown) { return; }
    const result = processJSContent(node.innerHTML, cssJsonMap);
    node.set_content(result);
  });

  return root.toString();
};

const replaceClasses = ({
  cssFiles,
  htmlFiles,
  jsFiles,
  cssJsonMap,
  excludedClasses,
  distributionPath
}: ReplaceClassType) => {
  cssFiles.forEach((file) => {
    const content = fs.readFileSync(file, 'utf8');
    const cssFile = postcss.parse(content);
    replaceCss(cssFile, cssJsonMap);

    fs.writeFileSync(file, cssFile.toResult().css);
    if (distributionPath) {
      fs.writeFileSync(`${distributionPath}/css_json_map.json`, JSON.stringify(cssJsonMap, null, 2));
    }
  });

  if (excludedClasses.length > 0) {
    excludedClasses.forEach((className) => { delete cssJsonMap[className]; });
  }

  htmlFiles.forEach((file) => {
    const content = fs.readFileSync(file, 'utf8');
    const updatedContent = replaceHtml(content, cssJsonMap);

    fs.writeFileSync(file, updatedContent, 'utf8');
  });

  jsFiles.forEach((file) => {
    const content = fs.readFileSync(file, 'utf8');
    const updatedContent = processJSContent(content, cssJsonMap);

    fs.writeFileSync(file, updatedContent, 'utf8');
  });
};

export { replaceCss, replaceHtml, replaceClasses };