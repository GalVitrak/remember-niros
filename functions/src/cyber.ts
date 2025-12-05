import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import * as bcrypt from "bcrypt";

dotenv.config();

const JWT = process.env.JWT_SECRET;

if (!JWT) {
  throw new Error(
    "JWT_SECRET environment variable is required"
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
  console.log("cyka");
  console.log(user);
  console.log("cyka");

  const container = { user };
  const options = { expiresIn: 31536000 }; // 1 year in seconds

  console.log(container);

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
