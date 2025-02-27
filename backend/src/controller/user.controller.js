import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import {
  setTicketTokenOnCookie,
  setUserTicketTokenOnCookie,
} from "../lib/util.js";
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
