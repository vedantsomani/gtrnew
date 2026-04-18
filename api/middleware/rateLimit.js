// File: api/middleware/rateLimit.js
// Purpose: Prevent DOS attacks via request flooding

// In-memory store (resets on Vercel redeploy)
const requestLog = new Map();

export function rateLimit(maxRequests = 10, windowMs = 60000) {
  return (req, res, next) => {
    // Get client IP (handles Vercel X-Forwarded-For)
    const ip = 
      req.headers['x-forwarded-for']?.split(',')[0] || 
      req.headers['cf-connecting-ip'] || 
      req.connection.remoteAddress || 
      'unknown';

    const now = Date.now();

    // Get requests for this IP within time window
    if (!requestLog.has(ip)) {
      requestLog.set(ip, []);
    }

    const timestamps = requestLog
      .get(ip)
      .filter(time => now - time < windowMs);

    timestamps.push(now);
    requestLog.set(ip, timestamps);

    // Check if exceeded limit
    if (timestamps.length > maxRequests) {
      console.warn(
        `\u26A0\uFE0F RATE LIMIT: IP ${ip} exceeded ${maxRequests} requests in ${windowMs}ms`
      );
      
      return res.status(429).json({
        error: 'Too many requests. Please wait before trying again.',
        retryAfter: Math.ceil(windowMs / 1000),
      });
    }

    // Cleanup old entries (every 1% of requests)
    if (Math.random() < 0.01) {
      for (const [key, times] of requestLog.entries()) {
        const recent = times.filter(t => now - t < windowMs);
        if (recent.length === 0) {
          requestLog.delete(key);
        } else {
          requestLog.set(key, recent);
        }
      }
    }

    // Call next middleware
    next?.();
  };
}

export function createRateLimitMiddleware(maxRequests, windowMs) {
  const limitFn = rateLimit(maxRequests, windowMs);
  return (req, res, next) => limitFn(req, res, next);
}
