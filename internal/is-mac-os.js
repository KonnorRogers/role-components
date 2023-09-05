
/**
 * Detects if on a macOS device so we can properly bind things like metaKey
 * https://developer.mozilla.org/en-US/docs/Web/API/Navigator/platform
 * > But there is one case where, among the options you could use, navigator.platform may be the least-bad option: When you need to show users advice about whether the modifier key for keyboard shortcuts is the ⌘ command key (found on Apple systems) rather than the ⌃ control key (on non-Apple systems):
 */
export function isMacOs() {
  return (
    navigator.platform.startsWith("Mac") ||
    navigator.platform.startsWith("iPhone")
  )
}
