import fs from 'node:fs';
import selectorParser from 'postcss-selector-parser';

const scanCSSSelectors = (content: string, selectorSet: Set<string>) => {
  const selectorRegex = /([^{}]+)(?={)/g;
  let match: null | RegExpExecArray = selectorRegex.exec(content);

  const scanner = selectorParser((selectors) => {
    selectors.walk((node) => {
      if (node.type === 'class' || node.type === 'id') {
        selectorSet.add(node.value);
      }
    });
  });

  while (match !== null) {
    scanner.processSync(match[0]);
    match = selectorRegex.exec(content);
  }
};

const scanHTMLSelectors = (content: string, selectorSet: Set<string>) => {
  const htmlRegex = /(?:class|id)=["']([^"']+)["']/g;
  let match: null | RegExpExecArray = htmlRegex.exec(content);

  while (match !== null) {
    if (typeof match[1] === 'string') {
      const parts = match[1].split(/\s+/);
      parts.forEach((part) => {
        if (part) { selectorSet.add(part); }
      });
    }
    match = htmlRegex.exec(content);
  }
};

const scanForSelectors = (files: string[], selectorSet: Set<string>) => {
  files.forEach((file) => {
    const content = fs.readFileSync(file, 'utf8');
    const extension = file.split('.').pop();

    if (extension === 'css') {
      scanCSSSelectors(content, selectorSet);
    } else {
      scanHTMLSelectors(content, selectorSet);
    }
  });
};

export { scanForSelectors, scanCSSSelectors, scanHTMLSelectors };