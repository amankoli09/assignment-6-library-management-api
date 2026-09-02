const logger = (req, res, next) => {
  const method = req.method;
  const url = req.originalUrl;
  const timestamp = new Date().toISOString();
  const userId = req.user ? req.user.userId : 'Guest';

  const methodColors = {
    GET: '\x1b[32m',    // green
    POST: '\x1b[34m',   // blue
    PUT: '\x1b[33m',    // yellow
    DELETE: '\x1b[31m', // red
    PATCH: '\x1b[35m',  // magenta
  };
  const reset = '\x1b[0m';
  const color = methodColors[method] || '\x1b[37m';

  console.log(`[${timestamp}] ${color}${method}${reset} ${url} — User: ${userId}`);
  next();
};

module.exports = logger;
