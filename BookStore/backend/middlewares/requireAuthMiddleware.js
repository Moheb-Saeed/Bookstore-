const authService = require("../services/authService");

const requireAuthMiddleware = async (req, res, next) => {
  console.log("Validating user authenticaiton...");

  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).send({ message: "Missing access token." })
  const token = authHeader.substring(7);
console.log(token);
  try {
    const results = await authService.verifyToken(token);
    console.log("User authenticated:", results);
    req.currentUser = { id: results.sub, email: results.email, role: results.role };
    return next();
  } catch (err) {
    console.log(err);
    res.status(401).send({ message: "Unauthorized" })
  }
}


module.exports = requireAuthMiddleware;