/**
 * Hash a plain text string using SHA-256 via Web Crypto API.
 * Produces a 64-character hexadecimal string.
 * @param {string} text - The string to hash
 * @returns {Promise<string>} - The SHA-256 hex string
 */
export async function hashPassword(text) {
  if (!text) return '';
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
