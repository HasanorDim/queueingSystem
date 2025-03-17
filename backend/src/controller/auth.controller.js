import pool from "../config/db.js";
import { authUserID, loginAuthUserID } from "../functions/create.auth.user.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

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

    const id = uuidv4();

    const authUser = await authUserID(
      id,
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
      "SELECT id, email, role, is_user_info_set FROM users WHERE id = ?",
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
  res.clearCookie("jwt_ticket_user");
  // Send response to indicate successful logout
  res.status(200).json({ message: "Logged out successfully" });
};

export const checkAuth = async (req, res) => {
  const user = req.user;
  const connection = await pool.getConnection();
  try {
    const query =
      "SELECT id, firstname, lastname, email, role, is_user_info_set FROM users WHERE id = ?";
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

export const userInfo = async (req, res) => {
  const { barangay, city, houseNumber, phoneNumber, province, street } =
    req.body;
  const user = req.user;
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const id = uuidv4();

    const query = `INSERT INTO user_detailstb (id, phone_number, house_number, street, city, barangay, province, user_id) VALUES (?,?,?,?,?,?,?,? )`;
    await connection.query(query, [
      id,
      phoneNumber,
      houseNumber,
      street,
      city,
      barangay,
      province,
      user.id,
    ]);

    const queryUser = `UPDATE users 
SET is_user_info_set = ?
WHERE id = ?`;
    await connection.query(queryUser, [true, user.id]);

    const retreivequery =
      "SELECT id, firstname, lastname, email, role, is_user_info_set FROM users WHERE id = ?";
    const [rows] = await connection.execute(retreivequery, [user.id]);

    await connection.commit();
    return res.status(200).json(rows[0]);
  } catch (error) {
    await connection.rollback();
    console.log("Error in checkAuth", error);
    return res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
};
