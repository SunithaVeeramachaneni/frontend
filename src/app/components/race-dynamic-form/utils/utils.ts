export const escapeRegex = (str: string) =>
  str.replace(/[-\/\\^$*+_?.()|[\]{}]/g, '\\$&');

export const generateCopyRegex = (name: string): RegExp => {
  const escapedName = escapeRegex(name);
  return new RegExp(`^${escapedName} Copy\\((\\d+)\\)`);
};

export const generateCopyNumber = (currentNumbers: number[]): number => {
  let newIndex = 0;
  const sorter = (a: number, b: number) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  };
  currentNumbers.sort(sorter);
  let isInOrder: boolean;
  currentNumbers = currentNumbers.filter((value, index, self) => {
    return self.indexOf(value) === index;
  });
  if (currentNumbers?.length)
    isInOrder = currentNumbers.every((num, index) => {
      newIndex += 1;
      return num === index + 1;
    });
  else newIndex = 1;
  if (isInOrder) newIndex += 1;
  return newIndex;
};

export const isJson = (str: string): boolean => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};
