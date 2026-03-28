/* eslint-disable max-statements */
/* eslint-disable no-param-reassign */
import { parse as jsParse } from 'acorn';
import { parse } from 'node-html-parser';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';

import { getFilesByExtension } from './util/file';
import { generateShortName } from './util/shorthener';

import type { OptionType } from '@src/type/option_type';
import type { AnyNode } from 'acorn';
import type { AstroIntegration } from 'astro';

const processJSContent = (content: string, classMap: Record<string, string>): string => {
  const ast = jsParse(content, {
    ecmaVersion: 'latest',
    sourceType: 'module'
  }) as AnyNode;

  // Creamos una lista para guardar qué queremos cambiar y dónde
  const replacements: { end: number; start: number; value: string }[] = [];

  // Función recursiva para encontrar los Literals
  const walk = (node: null | AnyNode) => {
    if (!node || typeof node !== 'object') { return; }

    // Si encontramos el Literal que buscamos
    if (node.type === 'Literal' && typeof node.value === 'string') {
      const original = node.value;
      const words = original.split(/\s+/);

      const replaced = words.map((word) => {
        if (word.startsWith('.')) {
          const name = word.slice(1);
          return classMap[name] ? `.${classMap[name]}` : word;
        }
        return classMap[word] || word;
      }).join(' ');

      if (replaced !== original) {
        replacements.push({
          start: node.start,
          end: node.end,
          value: JSON.stringify(replaced) // JSON.stringify pone las comillas ""
        });
      }
    }

    // Usamos forEach sobre las llaves del objeto para seguir bajando
    Object.keys(node).forEach((key) => {
      const child = node[key];
      if (child && typeof child === 'object') {
        if (Array.isArray(child)) {
          // Si es un array (como ast.body), usamos forEach
          child.forEach((nodeInArray) => { walk(nodeInArray); });
        } else {
          walk(child);
        }
      }
    });
  };

  // 1. Llenamos la lista de reemplazos
  walk(ast);

  // 2. ORDENAR de atrás hacia adelante (Importante para no romper índices)
  replacements.sort((a, b) => b.start - a.start);

  // 3. Aplicar los cambios al string original
  let updatedContent = content;
  replacements.forEach((rep) => {
    const prefix = updatedContent.slice(0, rep.start);
    const suffix = updatedContent.slice(rep.end);
    updatedContent = prefix + rep.value + suffix;
  });

  return updatedContent;
};

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

const classShortener = (_options?: OptionType): AstroIntegration => ({
  name: 'class-shortener',
  hooks: {
    'astro:build:done': ({ dir: directory }) => {
      const distributionPath = fileURLToPath(directory);
      const { cssFiles, htmlFiles, jsFiles } = getFilesByExtension(distributionPath);
      const cssJsonMap: Record<string, string> = {};

      cssFiles.forEach((file) => {
        const content = fs.readFileSync(file, 'utf8');
        const cssFile = postcss.parse(content);
        replaceCss(cssFile, cssJsonMap);

        fs.writeFileSync(file, cssFile.toResult().css);
        fs.writeFileSync('./cssJsonMap.json', JSON.stringify(cssJsonMap, null, 2));
      });

      htmlFiles.forEach((file) => {
        const content = fs.readFileSync(file, 'utf8');
        const root = parse(content);
        const elements = root.querySelectorAll('*');

        elements.forEach((element) => {
          const attributeNames = element.attributes;

          Object.keys(attributeNames).forEach((item) => {
            if (item === 'class') {
              const classAttribute = attributeNames[item];

              if (classAttribute) {
                const classNames = classAttribute.split(/\s+/);
                const newClassNames = classNames.map((name) => cssJsonMap[name] ?? name);

                element.setAttribute('class', newClassNames.join(' '));
              }
            }

            if (item.startsWith('data-')) {
              const attributeValue = attributeNames[item];

              if (attributeValue) {
                const names = attributeValue.split(/\s+/);
                const shortenedData = names.map((name) => cssJsonMap[name] ?? name);

                element.setAttribute(item, shortenedData.join(' '));
              }
            }
          });

          const script = root.querySelectorAll('script');

          script.forEach((node) => {
            const isPartyTown = node.innerHTML.includes('partytown');
            if (isPartyTown) { return; }
            const result = processJSContent(node.innerHTML, cssJsonMap);
            node.set_content(result);
          });
        });

        fs.writeFileSync(file, root.toString(), 'utf8');
      });

      jsFiles.forEach((file) => {
        const content = fs.readFileSync(file, 'utf8');
        const ast = jsParse(content, { ecmaVersion: 'latest', sourceType: 'module' });
        const updatedContent = content;

        ast.body.forEach((node) => {
          if (node.type === 'ExpressionStatement' && node.expression.type === 'AssignmentExpression') {
            const { left, right } = node.expression;

            if (
              left.type === 'MemberExpression'
              && left.object.type === 'Identifier'
              && left.object.name === 'module'
              && left.property.type === 'Identifier'
              && left.property.name === 'exports'
              && right.type === 'ObjectExpression'
            ) {
              right.properties.forEach((property) => {
                if (
                  property.type === 'Property'
                  && property.key.type === 'Identifier'
                  && property.key.name === 'classMap'
                  && property.value.type === 'ObjectExpression'
                ) {
                  property.value.properties.forEach((classProperty) => {
                    if (
                      classProperty.type === 'Property'
                      && classProperty.key.type === 'Literal'
                      && typeof classProperty.key.value === 'string'
                      && classProperty.value.type === 'Literal'
                      && typeof classProperty.value.value === 'string'
                    ) {
                      const originalClass = classProperty.key.value;
                      const shortClass = classProperty.value.value;
                      cssJsonMap[originalClass] = shortClass;
                    }
                  });
                }
              });
            }
          }
        });

        fs.writeFileSync(file, updatedContent, 'utf8');
      });
    }
  }
});

export { classShortener };