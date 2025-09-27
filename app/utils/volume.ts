export function parseVolume(volume: number) {
  return Math.floor(volume / 10000) + (volume % 10) * 0.1;
}
