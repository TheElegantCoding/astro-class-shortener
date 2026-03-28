import { parse as jsParse } from 'acorn';

import type { AnyNode } from 'acorn';

const processJSContent = (content: string, classMap: Record<string, string>): string => {
  const ast = jsParse(content, {
    ecmaVersion: 'latest',
    sourceType: 'module'
  }) as AnyNode;

  const replacements: { end: number; start: number; value: string }[] = [];

  const walk = (node: null | AnyNode) => {
    if (!node || typeof node !== 'object') { return; }

    if (node.type === 'Literal' && typeof node.value === 'string') {
      const original = node.value;
      const words = original.split(/\s+/);

      const replaced = words.map((word) => {
        if (word.startsWith('.')) {
          const name = word.slice(1);
          return classMap[name] ? `.${classMap[name]}` : word;
        }
        return classMap[word] ?? word;
      }).join(' ');

      if (replaced !== original) {
        replacements.push({
          start: node.start,
          end: node.end,
          value: JSON.stringify(replaced)
        });
      }
    }

    Object.keys(node).forEach((key) => {
      const keyValue = key as unknown as keyof AnyNode;
      const child = node[keyValue];

      if (child && typeof child === 'object') {
        if (Array.isArray(child)) {
          child.forEach((nodeInArray) => { walk(nodeInArray as unknown as AnyNode); });
        } else {
          walk(child as unknown as AnyNode);
        }
      }
    });
  };

  walk(ast);

  replacements.sort((first, second) => second.start - first.start);

  let updatedContent = content;
  replacements.forEach((rep) => {
    const prefix = updatedContent.slice(0, rep.start);
    const suffix = updatedContent.slice(rep.end);
    updatedContent = prefix + rep.value + suffix;
  });

  return updatedContent;
};

export { processJSContent };