import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import {
  setTicketTokenOnCookie,
  setUserTicketTokenOnCookie,
} from "../lib/util.js";
import { io } from "../lib/socket.js";
import { broadcastTableWindowUpdate } from "../functions/socket.helper.js";
import {
  departmentAnalyticsSuper,
  getAverageProcessTime,
  getAverageProcessTimeSuper,
  getTicketStats,
  getTicketStatsSuper,
  serviceDistribution,
  serviceDistributionSuper,
  userInThisMonth,
} from "../functions/getFunctions.js";
import { allTicketsCount } from "../functions/Super.getFunction.js";

dotenv.config();

export const requestTicket = async (req, res) => {
  const { service_type, status, windowId } = req.body;
  const { id: userID } = req.user;

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const ticketId = uuidv4();

    //   const insertQuery = `
    //     INSERT INTO window_tickettb (id, window_id, ticket_number, user_id, service_type, status)
    //     SELECT ?, ?, COALESCE(MAX(ticket_number), 0) + 1, ?, ?, ?
    //     FROM window_tickettb
    //     WHERE window_id = ?;
    // `;

    const windowQuery =
      "SELECT department_id FROM service_windowtb WHERE id = ?";
    const [department_id] = await connection.execute(windowQuery, [windowId]);

    const departmentId = department_id[0].department_id;

    const insertQuery = `
      INSERT INTO window_tickettb (id, window_id, ticket_number, user_id, service_type, status, department_id)
      SELECT ?, ?, COALESCE(MAX(ticket_number), 0) + 1, ?, ?, ?, ?
      FROM window_tickettb
      WHERE window_id = ?
        AND DATE(issued_at) = CURDATE();
    `;

    await connection.execute(insertQuery, [
      ticketId,
      windowId,
      userID,
      service_type,
      status,
      departmentId,
      windowId,
    ]);

    const selectQuery = `SELECT * FROM window_tickettb WHERE id = ?`;
    const [rows] = await connection.execute(selectQuery, [ticketId]);

    const data = rows[0];

    io.emit("getNewTicket", data);

    // Generate a JWT with department data
    const token = jwt.sign(
      {
        userTicketId: ticketId,
      },
      process.env.JWT_SECRET // Replace with an environment variable in production
      // { expiresIn: "1h" } // Token expiration time
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
    await connection.commit();
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
      process.env.JWT_SECRET // Replace with an environment variable in production
      // { expiresIn: "1h" }
    );

    // ✅ Set token as a secure HTTP-only cookie
    setTicketTokenOnCookie(token, res);

    const query =
      "SELECT id, service_total, name, description, status, qr_code FROM departments WHERE id = ?";
    const [rows] = await connection.execute(query, [departmentId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Department not found" });
    }
    await connection.commit();

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
      SELECT sw.*, wt.*
      FROM window_tickettb wt
      INNER JOIN service_windowtb sw ON wt.window_id = sw.id
      WHERE wt.id = ?;
    `;

    const [rows] = await connection.execute(query, [userTicketId]);
    await connection.commit();

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
    //   const query = `
    //   SELECT COALESCE(MAX(ticket_number), 0) + 1 AS max_ticket
    //   FROM window_tickettb
    //   WHERE window_id = ?;
    // `;

    const query = `
      SELECT COALESCE(MAX(ticket_number), 0) + 1 AS max_ticket
      FROM window_tickettb 
      WHERE window_id = ?
        AND DATE(issued_at) = CURDATE();
    `;

    const [rows] = await connection.execute(query, [windowId]);
    await connection.commit();

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
    const result = await allTicketsCount();
    return res.status(200).json(result);
  } catch (error) {
    await connection.rollback();
    console.log("Error in totalTickets", error);
    return res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
};

export const totalTicketsByDepartments = async (req, res) => {
  const user = req.user;
  const departmentId = user.department_id;

  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const query = `SELECT * FROM window_tickettb WHERE department_id = ?`;

    const [rows] = await connection.execute(query, [departmentId]);
    await connection.commit();

    // Count total by status
    const resultCount = rows.reduce((acc, row) => {
      acc[row.status] = (acc[row.status] || 0) + 1;
      return acc;
    }, {});

    return res.status(200).json({ rows, resultCount });
  } catch (error) {
    await connection.rollback();
    console.log("Error in totalTickets", error);
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

    const queryUser = `SELECT department_id FROM users WHERE id = ?`;
    const [rowsUser] = await connection.execute(queryUser, [user.id]);

    // const query = `
    //   SELECT wt.*, sw.*, u.firstname, u.lastname
    //   FROM window_tickettb wt
    //   LEFT JOIN service_windowtb sw ON sw.id = wt.window_id
    //   LEFT JOIN users u ON wt.user_id = u.id
    //   WHERE sw.department_id = ?
    //   AND wt.DATE(issued_at) = CURDATE()
    //   AND wt.status != 'completed'
    //   ;
    // `;
    const query = `
      SELECT wt.*, sw.*, u.firstname, u.lastname
      FROM window_tickettb wt
      LEFT JOIN service_windowtb sw ON sw.id = wt.window_id
      LEFT JOIN users u ON wt.user_id = u.id
      WHERE sw.department_id = ?
      AND DATE(wt.issued_at) = CURDATE()
      AND wt.status != 'completed';
    `;

    const [rows] = await connection.execute(query, [user.department_id]);

    const counter = `SELECT * FROM service_windowtb WHERE department_id = ?`;
    const [windows] = await connection.execute(counter, [
      rowsUser[0].department_id,
    ]);
    await connection.commit();
    return res.status(200).json({ rows, windows });
  } catch (error) {
    await connection.rollback();
    console.log("Error in get all tickets ", error);
    return res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
};

export const ticketStatus = async (req, res) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const { ticketId, status } = req.body;

    if (status === "completed") {
      const currentTime = new Date();

      const selectQuery = `SELECT called_at FROM window_tickettb WHERE id = ?`;
      const [ticket] = await connection.execute(selectQuery, [ticketId]);

      if (ticket.length === 0) {
        throw new Error("Ticket not found.");
      }

      // Parse the 'called_at' time from the database result
      const calledAtTime = new Date(ticket[0].called_at);

      // Calculate the time difference in minutes
      const timeDifferenceInMinutes = (currentTime - calledAtTime) / 1000 / 60; // Convert from milliseconds to minutes

      // Determine whether the ticket meets the SLA (20 minutes or less)
      const metSla = timeDifferenceInMinutes <= 20;

      // Update the 'met_sla' value based on the time difference
      const updateQuery = `UPDATE window_tickettb SET status = ?, met_sla = ?, completed_at = NOW() WHERE id = ?`;
      const [result] = await connection.execute(updateQuery, [
        status,
        metSla,
        ticketId,
      ]);

      if (result.affectedRows === 0) {
        throw new Error("Ticket not found or no changes made.");
      }

      console.log(`Ticket SLA status updated: ${metSla ? "Met" : "Not Met"}`);
    } else {
      // Update ticket status
      const updateQuery = `UPDATE window_tickettb SET status = ?, called_at = NOW() WHERE id = ?`;
      const [result] = await connection.execute(updateQuery, [
        status,
        ticketId,
      ]);

      if (result.affectedRows === 0) {
        throw new Error("Ticket not found or no changes made.");
      }
    }

    const selectQuery = `SELECT * FROM window_tickettb WHERE id = ?`;
    const [rows] = await connection.execute(selectQuery, [ticketId]);

    const window_id = rows[0].window_id;

    const queryUser = `
      SELECT users.id AS user_id, users.firstname, users.lastname, users.email,
            user_detailstb.id AS detail_id, user_detailstb.phone_number, user_detailstb.city, user_detailstb.age,
            window_tickettb.id AS ticket_id, window_tickettb.ticket_number, window_tickettb.status, window_tickettb.service_type
      FROM users
      INNER JOIN user_detailstb ON users.id = user_detailstb.user_id
      INNER JOIN window_tickettb ON users.id = window_tickettb.user_id
      WHERE window_tickettb.window_id = ?
      AND window_tickettb.status != 'completed';
    `;

    const [rowsUser] = await connection.execute(queryUser, [window_id]);

    const formattedUsers = rowsUser.map((row) => ({
      users: {
        id: row.user_id,
        firstname: row.firstname,
        lastname: row.lastname,
        email: row.email,
      },
      user_details: {
        id: row.detail_id,
        age: row.age,
        phone_number: row.phone_number,
        city: row.city,
      },
      window: {
        id: row.ticket_id,
        ticket_number: row.ticket_number,
        service_type: row.service_type,
        status: row.status,
      },
    }));
    broadcastTableWindowUpdate(formattedUsers);
    await connection.commit();
    return res
      .status(200)
      .json({ message: "Ticket status updated successfully" });
  } catch (error) {
    await connection.rollback();
    console.error("Error updating ticket status:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  } finally {
    connection.release();
  }
};

export const nextWindow = async (req, res) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const { window, user } = req.body;

    const ticketId = uuidv4();

    // const insertQuery = `
    //     INSERT INTO window_tickettb (id, window_id, ticket_number, user_id, service_type, status)
    //     SELECT ?, ?, COALESCE(MAX(ticket_number), 0) + 1, ?, ?, ?
    //     FROM window_tickettb
    //     WHERE window_id = ?;
    // `;

    const windowQuery =
      "SELECT department_id FROM service_windowtb WHERE id = ?";
    const [department_id] = await connection.execute(windowQuery, [window.id]);

    const departmentId = department_id[0].department_id;

    const insertQuery = `
      INSERT INTO window_tickettb (id, window_id, ticket_number, user_id, service_type, status, department_id)
      SELECT ?, ?, COALESCE(MAX(ticket_number), 0) + 1, ?, ?, ?, ?
      FROM window_tickettb
      WHERE window_id = ?
        AND DATE(issued_at) = CURDATE();
    `;

    await connection.execute(insertQuery, [
      ticketId,
      window.id,
      user.id,
      window.service_type,
      "waiting",
      departmentId,
      window.id,
    ]);

    await connection.commit();
    // broadcastTableWindowUpdate(formattedUsers);
    return res.status(204).json();
  } catch (error) {
    await connection.rollback();
    console.log("Error in get all tickets ", error);
    return res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
};

export const notPresent = async (req, res) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const { ticketId, status } = req.body;
    const updateQuery = `UPDATE window_tickettb SET status = ?, called_at = NOW() WHERE id = ?`;
    const [result] = await connection.execute(updateQuery, [status, ticketId]);

    const selectQuery = "SELECT * FROM window_tickettb WHERE id = ?";
    const [rows] = await connection.execute(selectQuery, [ticketId]);

    const data = rows[0];

    const calledAtTimestamp = new Date(data.called_at).getTime();
    io.emit("ticketCalled", { ticketId, calledAt: calledAtTimestamp });
    if (result.affectedRows === 0) {
      throw new Error("No ticket found with the given ID");
    }

    await connection.commit();
    res.status(201).json(); // 204: No Content
  } catch (error) {
    await connection.rollback();
    console.error("Error updating ticket status:", error);
    res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
};

export const getVoided = async (req, res) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const selectQuery = "SELECT * FROM window_tickettb WHERE status = ?";
    const [rows] = await connection.execute(selectQuery, ["ticketId"]);

    const data = rows[0];

    await connection.commit();
    res.status(201).json(data);
  } catch (error) {
    await connection.rollback();
    console.error("Error updating ticket status:", error);
    res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
};

export const getFunction = async (req, res) => {
  try {
    const userData = req.user;
    const avgTime = await getAverageProcessTime(userData);
    const ticketStat = await getTicketStats(userData);
    const serviceDistributions = await serviceDistribution(userData);
    const newUsers = await userInThisMonth();

    res
      .status(200)
      .json({ avgTime, ticketStat, serviceDistributions, newUsers });
  } catch (error) {
    console.error("Error updating ticket status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getFunctionSuper = async (req, res) => {
  try {
    const avgTime = await getAverageProcessTimeSuper();
    const ticketStat = await getTicketStatsSuper();
    const serviceDistributions = await serviceDistributionSuper();
    const newUsers = await userInThisMonth();
    const departmentAnalytics = await departmentAnalyticsSuper();

    console.log("departmentAnalytics: ", departmentAnalytics);

    res.status(200).json({
      avgTime,
      ticketStat,
      serviceDistributions,
      newUsers,
      departmentAnalytics,
    });
  } catch (error) {
    console.error("Error updating ticket status:", error);
    res.status(500).json({ message: "Server error" });
  }
};
