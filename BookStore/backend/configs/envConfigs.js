process.loadEnvFile();

const PORT = process.env.PORT;
const PREFIX = process.env.PREFIX;
const MONGODB_URL = process.env.MONGODB_URL;
const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

module.exports = {
    PORT,
    PREFIX,
    MONGODB_URL,
    jwtSecret,
    jwtExpiresIn
}