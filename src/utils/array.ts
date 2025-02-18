export function getRandomItemFromStringArray(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function shuffleArray<T>(inputArray: T[]): T[] {
  const array = [...inputArray];

  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}
