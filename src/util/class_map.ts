import { generateShortName } from './shorthener';

const createClassMap = (selectors: string[]) => {
  const sorted = [...selectors].toSorted((first, second) => second.length - first.length);
  const map: Record<string, string> = {};

  sorted.forEach((sel, index) => { map[sel] = generateShortName(index); });

  return map;
};

export { createClassMap };