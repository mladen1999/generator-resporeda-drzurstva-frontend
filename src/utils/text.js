export function splitLines(text) {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}
