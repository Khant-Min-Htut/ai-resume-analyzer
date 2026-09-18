const NULL_BYTE_RE = /\0/g;

const CONTROL_CHAR_RE = /[\x00-\x08\x0B\x0C\x0E-\x1F]/g;

export function sanitizeText(input: string): string {
  if (typeof input !== 'string') return '';
  return input.replace(NULL_BYTE_RE, '').replace(CONTROL_CHAR_RE, '');
}

export function truncateText(input: string, maxLength: number): string {
  if (typeof input !== 'string') return '';
  return input.length > maxLength ? input.slice(0, maxLength) : input;
}

export function sanitizeAndTruncate(input: string, maxLength: number): string {
  return truncateText(sanitizeText(input), maxLength);
}

export function isPdfMagicBytes(buffer: Buffer): boolean {
  if (!buffer || buffer.length < 5) return false;
  return (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46
  );
}
