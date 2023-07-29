export const parseVolume = (volume: number) =>
  Math.floor(volume / 10000) + (volume % 10) * 0.1;
