export const arraysEqual = (arr1: string[], arr2: string[]) =>
  arr1.length === arr2.length && arr1.every((id) => arr2.includes(id));
