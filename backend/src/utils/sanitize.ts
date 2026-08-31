/**
 * Input sanitization utilities.
 *
 * Treats ALL user-supplied text as untrusted data.
 */

/** Strip null bytes. */
const NULL_BYTE_RE = /\0/g;

/**
 * Strip C0 control characters except tab (\t=0x09), LF (\n=0x0A), CR (\r=0x0D).
 * Range: 0x00-0x08, 0x0B, 0x0C, 0x0E-0x1F.
 */
// eslint-disable-next-line no-control-regex
const CONTROL_CHAR_RE = /[\x00-\x08\x0B\x0C\x0E-\x1F]/g;

/**
 * Strip null bytes and dangerous control characters from a string.
 */
export function sanitizeText(input: string): string {
  if (typeof input !== 'string') return '';
  return input.replace(NULL_BYTE_RE, '').replace(CONTROL_CHAR_RE, '');
}

/**
 * Clamp a string to a maximum length, truncated from the end.
 */
export function truncateText(input: string, maxLength: number): string {
  if (typeof input !== 'string') return '';
  return input.length > maxLength ? input.slice(0, maxLength) : input;
}

/**
 * Sanitize and clamp in one step.
 */
export function sanitizeAndTruncate(input: string, maxLength: number): string {
  return truncateText(sanitizeText(input), maxLength);
}

/**
 * Check if a buffer starts with the PDF magic bytes (%PDF).
 */
export function isPdfMagicBytes(buffer: Buffer): boolean {
  if (!buffer || buffer.length < 5) return false;
  return (
    buffer[0] === 0x25 && // %
    buffer[1] === 0x50 && // P
    buffer[2] === 0x44 && // D
    buffer[3] === 0x46 // F
  );
}
