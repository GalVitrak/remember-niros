import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import * as bcrypt from "bcrypt";

// Load .env file for local development (emulators)
// In production, Firebase Functions secrets are automatically available as process.env
dotenv.config();

// JWT_SECRET is available from:
// - Local: functions/.env file (via dotenv)
// - Production: Firebase Functions secrets (automatically as process.env.JWT_SECRET)
const JWT = process.env.JWT_SECRET;

if (!JWT) {
  throw new Error(
    "JWT_SECRET environment variable is required.\n" +
      "For LOCAL development: Create functions/.env with JWT_SECRET=your_secret\n" +
      "For PRODUCTION: Run 'firebase functions:secrets:set JWT_SECRET'"
  );
}

async function hashPassword(
  password: string
): Promise<string> {
  const hashedPassword = await bcrypt.hash(
    password,
    10
  );
  return hashedPassword;
}

async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(
    password,
    hashedPassword
  );
}

// // a function to generate a new Token
function getNewToken(user: {}): string {
  const container = { user };
  const options = { expiresIn: 31536000 }; // 1 year in seconds

  const token = jwt.sign(
    container,
    JWT as string,
    options
  );
  return token;
}

// Function to verify a token
function verifyToken(token: string): any {
  try {
    const decoded = jwt.verify(
      token,
      JWT as string
    );
    return decoded;
  } catch (error) {
    return null;
  }
}

export default {
  getNewToken,
  verifyToken,
  hashPassword,
  comparePassword,
};
