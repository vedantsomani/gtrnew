// File: src/utils/validators.js
// Purpose: Input validation utilities for frontend

export const MAX_MESSAGE_LENGTH = 1000;
export const MAX_MESSAGES_PER_SESSION = 50;
export const REQUEST_TIMEOUT = 15000; // 15 seconds

export function validateMessage(text) {
  // Check if empty
  if (!text || !text.trim()) {
    return {
      valid: false,
      error: 'Message cannot be empty',
    };
  }

  // Check length
  if (text.length > MAX_MESSAGE_LENGTH) {
    return {
      valid: false,
      error: `Message must be under ${MAX_MESSAGE_LENGTH} characters (currently ${text.length})`,
    };
  }

  // Check for null bytes
  if (/\0/.test(text)) {
    return {
      valid: false,
      error: 'Message contains invalid characters',
    };
  }

  // Check for valid Unicode (allow most scripts: Latin, Devanagari, etc.)
  const validPattern = /^[\p{L}\p{N}\p{P}\p{Z}\p{S}\p{M}]*$/u;
  if (!validPattern.test(text)) {
    return {
      valid: false,
      error: 'Message contains invalid characters',
    };
  }

  return {
    valid: true,
  };
}

export function sanitizeForDisplay(text) {
  // Escape HTML to prevent XSS
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function createAbortController(timeout = REQUEST_TIMEOUT) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  return { controller, timeoutId };
}
