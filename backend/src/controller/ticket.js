import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import {
  setTicketTokenOnCookie,
  setUserTicketTokenOnCookie,
} from "../lib/util.js";
dotenv.config();

export const requestTicket = async (req, res) => {
  const { number, service_type, status, windowId } = req.body;
  const { id: userID } = req.user;

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const ticketId = uuidv4();

    const insertQuery = `
      INSERT INTO window_tickettb (id, window_id, ticket_number, user_id, service_type, status)
      SELECT ?, ?, COALESCE(MAX(ticket_number), 0) + 1, ?, ?, ?
      FROM window_tickettb
      WHERE window_id = ?;
  `;

    await connection.execute(insertQuery, [
      ticketId,
      windowId,
      userID,
      service_type,
      status,
      windowId, // First SELECT
    ]);

    const selectQuery = `SELECT * FROM window_tickettb WHERE id = ?`;
    const [rows] = await connection.execute(selectQuery, [ticketId]);

    const data = rows[0];

    // Generate a JWT with department data
    const token = jwt.sign(
      {
        userTicketId: ticketId,
      },
      process.env.JWT_SECRET, // Replace with an environment variable in production
      { expiresIn: "1h" } // Token expiration time
    );

    // ✅ Set token as a secure HTTP-only cookie
    setUserTicketTokenOnCookie(token, res);

    await connection.commit();

    return res.status(201).json(data);
  } catch (error) {
    await connection.rollback();
    console.log("Error in requestTicket", error);
    return res.status(400).json({ message: "Error in requesting ticket" });
  } finally {
    connection.release();
  }
};

export const checkAuth = async (req, res) => {
  //Department ID
  const user = req.ticketId;

  if (!user) {
    console.log("Ticket ID is required: ", user);
    return res.status(400).json({ error: "Ticket ID is required" });
  }

  const connection = await pool.getConnection();
  try {
    const query =
      "SELECT id, service_total, name, description, status, qr_code FROM departments WHERE id = ?";
    const [rows] = await connection.execute(query, [user]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Department not found" });
    }

    const data = rows[0];
    return res.status(200).json(data);
  } catch (error) {
    console.log("Error in checkAuth", error);
    return res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
};

export const setAuth = async (req, res) => {
  const { departmentId } = req.params;

  if (!departmentId) {
    return res.status(400).json({ error: "Department ID is required" });
  }

  const connection = await pool.getConnection();
  try {
    // Generate a JWT with department data
    const token = jwt.sign(
      {
        ticketId: departmentId,
      },
      process.env.JWT_SECRET, // Replace with an environment variable in production
      { expiresIn: "1h" } // Token expiration time
    );

    // ✅ Set token as a secure HTTP-only cookie
    setTicketTokenOnCookie(token, res);

    const query =
      "SELECT id, service_total, name, description, status, qr_code FROM departments WHERE id = ?";
    const [rows] = await connection.execute(query, [departmentId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Department not found" });
    }

    const data = rows[0];
    return res.status(200).json(data);
  } catch (error) {
    console.log("Error in setAuth", error);
    return res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
};

export const userTicket = async (req, res) => {
  const userTicketId = req.userTicketId;
  if (!userTicketId) {
    return res.status(400).json({ message: "Ticket ID is required" });
  }

  const connection = await pool.getConnection();
  try {
    const query = `
      SELECT wt.*, sw.* 
      FROM window_tickettb wt
      LEFT JOIN service_windowtb sw ON sw.id = wt.window_id
      WHERE wt.id = ?;
    `;

    const [rows] = await connection.execute(query, [userTicketId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No ticket found" });
    }

    return res.status(200).json(rows[0]); // Returns the merged ticket & window data
  } catch (error) {
    console.error("Error in userTicket", error);
    return res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
};

export const newestNumber = async (req, res) => {
  const windowId = req.params.windowId;
  const connection = await pool.getConnection();
  try {
    const query = `
    SELECT COALESCE(MAX(ticket_number), 0) + 1 AS max_ticket
    FROM window_tickettb 
    WHERE window_id = ?;
  `;

    const [rows] = await connection.execute(query, [windowId]);
    const maxTicketNumber = rows[0].max_ticket;
    return res.status(200).json({ new: maxTicketNumber });
  } catch (error) {
    console.log("Error in newestNumber", error);
    return res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
};

export const totalTickets = async (req, res) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const query = `
SELECT * FROM window_tickettb 
  `;

    const [rows] = await connection.execute(query);
    return res.status(200).json(rows);
  } catch (error) {
    await connection.rollback();
    console.log("Error in newestNumber", error);
    return res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
};

export const getAllTickets = async (req, res) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const user = req.user;
    console.log("user: ", user);

    const queryUser = `SELECT department_id FROM users WHERE id = ?`;
    const [rowsUser] = await connection.execute(queryUser, [user.id]);

    const query = `
      SELECT wt.*, sw.*, u.firstname, u.lastname
      FROM window_tickettb wt
      LEFT JOIN service_windowtb sw ON sw.id = wt.window_id
      LEFT JOIN users u ON wt.user_id = u.id
      WHERE sw.department_id = ?;
    `;
    const [rows] = await connection.execute(query, [rowsUser[0].department_id]);

    const counter = `SELECT * FROM service_windowtb WHERE department_id = ?`;
    const [windows] = await connection.execute(counter, [
      rowsUser[0].department_id,
    ]);

    return res.status(200).json({ rows, windows });
  } catch (error) {
    await connection.rollback();
    console.log("Error in get all tickets ", error);
    return res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
};
