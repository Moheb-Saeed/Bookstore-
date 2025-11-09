const loggerMiddleware = (req, res, next) => {
  const method = req.method;
  const path = req.path;
  const statusCode = res.statusCode;
  console.log(`${method} ${path} ${statusCode}`);
  next();
};

module.exports = loggerMiddleware;