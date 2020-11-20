export function toPercentage(number, max) {
  return `${Math.max(Math.round((number / max) * 100), 0)}%`;
}
