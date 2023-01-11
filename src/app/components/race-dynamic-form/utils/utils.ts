export const escapeRegex = (str: string) =>
  str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

export const generateCopyRegex = (name: string): RegExp => {
  const escapedName = escapeRegex(name);
  return new RegExp(`^${escapedName} Copy\\((\\d+)\\)`);
};

export const generateCopyNumber = (currentNumbers: number[]): number => {
  let newIndex = 0;
  const sorter = (a, b) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  };
  currentNumbers.sort(sorter);
  let isInOrder;
  if (currentNumbers?.length)
    isInOrder = currentNumbers.every((num, index) => {
      newIndex += 1;
      return num === index + 1;
    });
  else newIndex = 1;
  if (isInOrder) newIndex += 1;
  return newIndex;
};
