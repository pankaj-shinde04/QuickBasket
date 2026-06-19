// Wraps async route handlers so errors are automatically forwarded to Express error handler
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}
