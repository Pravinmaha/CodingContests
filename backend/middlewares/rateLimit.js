import rateLimit from 'express-rate-limit';

// Daily rate limit: 2 requests per user per day
export const dailyRateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 3, // Limit each user to 2 requests per windowMs
  message: {
    status: 429,
    message: 'You have exceeded the 3 submissions per day limit.'
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    // Use user ID if available, else fallback to IP
    return req.user?.userId || req.ip;
  }
});