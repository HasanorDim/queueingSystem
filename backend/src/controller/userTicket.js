import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { setUserTicketTokenOnCookie } from "../lib/util.js";

export const checkUserTicket = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(400).json({ message: "Ticket ID is required" });
  }

  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const query = `
      SELECT * 
      FROM window_tickettb 
      WHERE user_id = ? 
      AND (status = 'waiting' OR status = 'In Progress' OR status = 'On Hold' OR status = 'void');
    `;

    const [rows] = await connection.execute(query, [userId]);

    if (rows.length > 0) {
      const data = rows[0];
      const oldToken = req.cookies.jwt_ticket_user;
      if (oldToken) res.clearCookie("jwt_ticket_user");
      const token = jwt.sign(
        {
          userTicketId: data?.id,
        },
        process.env.JWT_SECRET // Replace with an environment variable in production
        // { expiresIn: "1h" } // Token expiration time
      );

      setUserTicketTokenOnCookie(token, res);

      const ticketQuery = `
        SELECT sw.*, wt.*
        FROM window_tickettb wt
        INNER JOIN service_windowtb sw ON wt.window_id = sw.id
        WHERE wt.id = ?;
    `;

      const [Ticketrow] = await connection.execute(ticketQuery, [data.id]);
      await connection.commit();

      if (Ticketrow.length === 0) {
        return res.status(404).json({ message: "No ticket found" });
      }

      await connection.commit();
      return res.status(200).json(Ticketrow[0]);
    }
    return res.status(204).json();
  } catch (error) {
    await connection.rollback();
    console.error("Error in checkUserTicket", error);
    return res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
};
