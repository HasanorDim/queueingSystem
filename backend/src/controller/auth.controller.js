import pool from "../config/db.js";
import { authUserID, loginAuthUserID } from "../functions/create.auth.user.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { email, password, firstname, lastname } = req.body;

  try {
    const connection = await pool.getConnection();
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required!" });

    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });

    const authUser = await authUserID(
      email,
      password,
      firstname,
      lastname,
      res
    );
    if (!authUser.success)
      return res
        .status(400)
        .json({ message: authUser.message || "Authentication failed" });

    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE id = ?",
      [authUser.userId]
    );

    const user = rows[0];

    connection.release();

    console.log("Login in User: ", user);
    return res.status(201).json(user);
  } catch (error) {
    console.log("Error in backend signup", error);
    return res
      .status(400)
      .json({ message: "Internal server error in backend signup" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required!" });

    const authUser = await loginAuthUserID(email, password, res);
    if (!authUser.success)
      return res
        .status(400)
        .json({ message: authUser.message || "Authentication failed" });

    const connection = await pool.getConnection();

    const [rows] = await connection.execute(
      "SELECT id, email, role FROM users WHERE id = ?",
      [authUser.userId]
    );

    const user = rows[0];

    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in backend login", error);
    return res
      .status(400)
      .json({ message: "Internal server error in backend login" });
  }
};

export const logout = (req, res) => {
  // Clear the JWT token from the cookie
  res.clearCookie("jwt"); // Adjust the cookie name if necessary

  // Send response to indicate successful logout
  res.status(200).json({ message: "Logged out successfully" });
};

export const checkAuth = async (req, res) => {
  const user = req.user;
  const connection = await pool.getConnection();
  try {
    const query =
      "SELECT id, firstname, lastname, email, role FROM users WHERE id = ?";
    const [rows] = await connection.execute(query, [user.id]);

    const data = rows[0];
    return res.status(200).json(data);
  } catch (error) {
    console.log("Error in checkAuth", error);
    return res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
};
