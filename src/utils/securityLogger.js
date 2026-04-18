// File: src/utils/securityLogger.js
// Purpose: Log security events for monitoring

const SECURITY_EVENTS = [];
const MAX_EVENTS_STORED = 100;

export class SecurityLogger {
  static log(type, severity, data) {
    const event = {
      timestamp: new Date().toISOString(),
      type, // 'injection_attempt', 'rate_limit', 'validation_error', etc.
      severity, // 'low', 'medium', 'high', 'critical'
      data,
      userAgent: navigator?.userAgent || 'unknown',
    };

    SECURITY_EVENTS.push(event);

    // Keep only recent events
    if (SECURITY_EVENTS.length > MAX_EVENTS_STORED) {
      SECURITY_EVENTS.shift();
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      const color =
        severity === 'critical' ? 'color: red; font-weight: bold;' :
        severity === 'high' ? 'color: orange; font-weight: bold;' :
        'color: yellow;';

      console.warn(
        `%c[SECURITY] ${type} (${severity})`,
        color,
        data
      );
    }
  }

  static getEvents(filter = {}) {
    return SECURITY_EVENTS.filter(event => {
      if (filter.type && event.type !== filter.type) return false;
      if (filter.severity && event.severity !== filter.severity) return false;
      return true;
    });
  }

  static clear() {
    SECURITY_EVENTS.length = 0;
  }

  static export() {
    return JSON.stringify(SECURITY_EVENTS, null, 2);
  }
}

// For debugging: expose to console in dev
if (process.env.NODE_ENV === 'development') {
  window.__securityLogger = SecurityLogger;
  console.log('🔒 SecurityLogger available at window.__securityLogger');
}
