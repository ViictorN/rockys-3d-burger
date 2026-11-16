/**
 * Zero-Trust Edge Input Validation, Whitelist Sanitization & Rate Limiting (P0)
 */

const ALLOWED_BOOKING_KEYS = new Set([
  'name',
  'phone',
  'guests',
  'date',
  'website',
  'location',
]);

const ALLOWED_GUEST_COUNTS = new Set(['1', '2', '4', '6']);
const ALLOWED_LOCATIONS = new Set(['soho', 'dtla']);
const PROMO_REGEX = /^[A-Z0-9]{3,16}$/;
const PHONE_REGEX = /^\+?[0-9\s().-]{7,20}$/;

const rateLimitBuckets = new Map();

/**
 * Strips HTML angle brackets, control characters, trims whitespace, and enforces max length.
 */
export function sanitizeText(input, maxLength = 120) {
  if (typeof input !== 'string') return '';
  let cleaned = '';
  for (let i = 0; i < input.length; i += 1) {
    const code = input.charCodeAt(i);
    if (code < 32 || code === 127) continue;
    const ch = input[i];
    if (ch === '<' || ch === '>') continue;
    cleaned += ch;
  }
  return cleaned.trim().slice(0, maxLength);
}

/**
 * Sliding-window in-memory rate limiter to prevent form flooding and coupon brute-force.
 */
export function checkRateLimit(key, maxRequests = 5, windowMs = 60000) {
  const safeKey = sanitizeText(String(key || 'global'), 64) || 'global';
  const now = Date.now();
  const history = rateLimitBuckets.get(safeKey) || [];
  const validHistory = history.filter((ts) => now - ts < windowMs);

  if (validHistory.length >= maxRequests) {
    const oldest = validHistory[0];
    const retryAfterMs = Math.max(1000, windowMs - (now - oldest));
    rateLimitBuckets.set(safeKey, validHistory);
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs,
    };
  }

  validHistory.push(now);
  rateLimitBuckets.set(safeKey, validHistory);

  return {
    allowed: true,
    remaining: Math.max(0, maxRequests - validHistory.length),
    retryAfterMs: 0,
  };
}

/**
 * Strict whitelist validation for table booking submissions (Anti-Mass-Assignment & Honeypot).
 */
export function validateBookingPayload(rawPayload) {
  if (!rawPayload || typeof rawPayload !== 'object' || Array.isArray(rawPayload)) {
    return { valid: false, data: null, error: 'Invalid reservation request format.' };
  }

  const keys = Object.keys(rawPayload);
  for (const key of keys) {
    if (!ALLOWED_BOOKING_KEYS.has(key)) {
      return {
        valid: false,
        data: null,
        error: `Rejected unexpected field "${sanitizeText(key, 32)}".`,
      };
    }
  }

  // Bot honeypot check: real users never fill the hidden website field
  if (typeof rawPayload.website === 'string' && rawPayload.website.trim().length > 0) {
    return {
      valid: false,
      data: null,
      error: 'Automated submission blocked by security verification.',
    };
  }

  const name = sanitizeText(rawPayload.name, 80);
  if (name.length < 2) {
    return {
      valid: false,
      data: null,
      error: 'Please enter your full name (minimum 2 characters).',
    };
  }

  const phone = sanitizeText(rawPayload.phone, 24);
  const digitCount = phone.replace(/\D/g, '').length;
  if (!PHONE_REGEX.test(phone) || digitCount < 7) {
    return {
      valid: false,
      data: null,
      error: 'Please enter a valid phone number (7 to 20 characters).',
    };
  }

  const guests = sanitizeText(rawPayload.guests, 4);
  if (!ALLOWED_GUEST_COUNTS.has(guests)) {
    return {
      valid: false,
      data: null,
      error: 'Please select a valid party size.',
    };
  }

  const date = sanitizeText(rawPayload.date, 60);
  if (date.length < 3) {
    return {
      valid: false,
      data: null,
      error: 'Please specify a preferred seating date and time.',
    };
  }

  const location = rawPayload.location
    ? sanitizeText(rawPayload.location, 16)
    : 'soho';
  if (!ALLOWED_LOCATIONS.has(location)) {
    return {
      valid: false,
      data: null,
      error: 'Please choose a valid kitchen location.',
    };
  }

  return {
    valid: true,
    data: { name, phone, guests, date, location },
    error: '',
  };
}

/**
 * Strict validation for promo/coupon codes.
 */
export function validatePromoCode(rawCode) {
  const normalized = sanitizeText(rawCode, 20).toUpperCase();
  if (!normalized) {
    return {
      valid: false,
      code: '',
      error: 'Enter a promo code first (try ROCKY10).',
    };
  }

  if (!PROMO_REGEX.test(normalized)) {
    return {
      valid: false,
      code: normalized,
      error: 'Promo code must be 3–16 alphanumeric characters.',
    };
  }

  return {
    valid: true,
    code: normalized,
    error: '',
  };
}
