import pool from "../config/db.js";
import dotenv from "dotenv";
import { usersCounts } from "../functions/user.helper.js";
dotenv.config();

export const allUsers = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const query = "SELECT * FROM users";
    const [rows] = await connection.execute(query);

    return res.status(200).json(rows);
  } catch (error) {
    console.log("Error in all users: ", error);
    return res.status(500).json({ message: "Error in fetching all users" });
  } finally {
    connection.release();
  }
};
export const allUsersCount = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const result = await usersCounts();
    return res.status(200).json(result);
  } catch (error) {
    console.log("Error in all users: ", error);
    return res.status(500).json({ message: "Error in fetching all users" });
  } finally {
    connection.release();
  }
};
