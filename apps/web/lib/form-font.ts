/** Use fonts available in the app or on the device; never silently fall back to Times. */
export function resolveFormFont(font?: string): string {
  if (font === "Geist Mono" || font === "JetBrains Mono")
    return "var(--font-geist-mono), monospace";
  if (font === "Georgia") return "Georgia, serif";
  if (font === "System Sans") return "system-ui, sans-serif";
  return "var(--font-geist-sans), system-ui, sans-serif";
}
