import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import { setTokenOnCookie } from "../lib/util.js";

// const secretKey = process.env.JWT_SECRET || "your_secret_key";

export const authUserID = async (
  id,
  email,
  password,
  firstname,
  lastname,
  res
) => {
  try {
    const connection = await pool.getConnection();

    // Check if user already exists
    const [existingUser] = await connection.execute(
      "SELECT id, password FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return { success: false, message: "Email already exists" };
    }

    // Trim the password before hashing
    const trimmedPassword = password.trim();

    // Hash the password before storing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(trimmedPassword, salt);

    // Insert user into MySQL database
    await connection.execute(
      "INSERT INTO users (id, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)",
      [id, firstname, lastname, email, hashedPassword]
    );

    const [user] = await pool.execute("SELECT id FROM users WHERE id = ?", [
      id,
    ]);

    connection.release();

    const userId = user.length > 0 ? user[0].id : null;

    // Generate JWT Token
    const token = jwt.sign(
      { id: userId, email },
      process.env.JWT_SECRET || "your_secret_key",
      {
        expiresIn: "1h",
      }
    );

    setTokenOnCookie(token, res);
    return { success: true, userId, token };
  } catch (err) {
    console.error("Error creating user from backend create.user: ", err);
    return { success: false, message: err.message };
  }
};

export const loginAuthUserID = async (email, password, res) => {
  try {
    const connection = await pool.getConnection();

    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    const user = rows[0];

    if (!user) {
      return { success: false, message: "Invalid credentials" };
    }

    // Trim the input password to remove any leading/trailing whitespace
    const trimmedPassword = password.trim();

    // Compare passwords
    const isPasswordCorrect = await bcrypt.compare(
      trimmedPassword,
      user.password
    );

    if (!isPasswordCorrect) {
      return { success: false, message: "Invalid credentials" };
    }

    connection.release();

    // Generate JWT Token with the user data
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        department_id: user.department_id,
      }, // Only include necessary user data
      process.env.JWT_SECRET || "your_secret_key"
      // { expiresIn: "1h" }
    );

    // Set the token on the client-side
    setTokenOnCookie(token, res);

    return { success: true, userId: user.id, token };
  } catch (err) {
    console.error("Error in login process:", err);
    return { success: false, message: err.message };
  }
};
