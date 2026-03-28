const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const generateShortName = (index: number): string => {
  let name = '';
  let step = index;

  while (step >= 0) {
    name = chars[step % chars.length] + name;
    step = Math.floor(step / chars.length) - 1;
  }

  return name;
};

export { generateShortName };