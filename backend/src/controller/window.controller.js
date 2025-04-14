import pool from "../config/db.js";
// import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import { broadcastTableWindowUpdate } from "../functions/socket.helper.js";
dotenv.config();

export const getWindow = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { windowId } = req.params;

    const queryUser = `SELECT * FROM service_windowtb WHERE id = ?`;
    const [rowsUser] = await connection.execute(queryUser, [windowId]);

    return res.status(200).json(rowsUser[0]);
  } catch (error) {
    console.log("Error in get all tickets ", error);
    return res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
};

export const deleteWindow = async (req, res) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction(); // Start a transaction

  try {
    const { windowId } = req.params;

    // Check if the window exists before deleting
    const checkQuery = `SELECT * FROM service_windowtb WHERE id = ?`;
    const [existingWindow] = await connection.execute(checkQuery, [windowId]);

    if (existingWindow.length === 0) {
      return res.status(404).json({ message: "Window not found" });
    }

    // Delete the window
    const deleteQuery = `DELETE FROM service_windowtb WHERE id = ?`;
    const [deleteResult] = await connection.execute(deleteQuery, [windowId]);

    if (deleteResult.affectedRows === 0) {
      throw new Error("Failed to delete window");
    }

    await connection.commit(); // Commit transaction

    return res.status(200).json({ message: "Window deleted successfully" });
  } catch (error) {
    await connection.rollback(); // Rollback on error
    console.error("Error deleting window:", error);
    return res.status(500).json({ message: "Server error" });
  } finally {
    connection.release(); // Release connection
  }
};

export const editWindow = async (req, res) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction(); // Start a transaction

  try {
    const { id, service_type, staff_name, window_number } = req.body;

    if (!service_type || !staff_name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Perform update
    const query = `
      UPDATE service_windowtb 
      SET service_type = ?, staff_name = ?
      WHERE id = ?
    `;
    const [result] = await connection.execute(query, [
      service_type,
      staff_name,
      id,
    ]);

    if (result.affectedRows === 0) {
      throw new Error("Window not found");
    }

    await connection.commit(); // Commit the transaction

    return res.status(200).json({ message: "Window updated successfully" });
  } catch (error) {
    await connection.rollback(); // Rollback on error
    console.error("Error updating window:", error);
    return res.status(500).json({ message: "Server error" });
  } finally {
    connection.release(); // Always release connection
  }
};

export const addWindow = async (req, res) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const { counters } = req.body;
    const { department_id: departmentId } = req.user;

    for (const item of counters) {
      // ✅ Use for...of instead of map()
      const query = `
        SELECT COALESCE(MAX(window_number), 0) + 1 AS max
        FROM service_windowtb
        WHERE department_id = ?;
      `;
      const [windowRow] = await connection.execute(query, [departmentId]);
      const nextWindowNumber = windowRow[0]?.max || 1;

      const insertsql = `INSERT INTO service_windowtb (id, department_id, service_type, window_number, staff_name)
        VALUES (?, ?, ?, ?, ?)`;

      await connection.execute(insertsql, [
        item.id,
        departmentId,
        item.name,
        nextWindowNumber,
        item.staff,
      ]);
    }

    const counter = `SELECT * FROM service_windowtb WHERE department_id = ?`;
    const [windows] = await connection.execute(counter, [departmentId]);

    await connection.commit();
    return res.status(200).json(windows);
  } catch (error) {
    await connection.rollback();
    console.log("Error in addWindow ", error);
    return res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
};

export const getTableWindow = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { windowId } = req.params;

    const queryUser = `
    SELECT users.id AS user_id, users.firstname, users.lastname, users.email,
          user_detailstb.id AS detail_id, user_detailstb.phone_number, user_detailstb.city, user_detailstb.age,
          window_tickettb.id AS ticket_id, window_tickettb.ticket_number, window_tickettb.status, window_tickettb.service_type
    FROM users
    INNER JOIN user_detailstb ON users.id = user_detailstb.user_id
    INNER JOIN window_tickettb ON users.id = window_tickettb.user_id
    WHERE window_tickettb.window_id = ? 
    AND window_tickettb.status NOT IN ('completed')
    AND DATE(issued_at) = CURDATE();
  `;

    const [rowsUser] = await connection.execute(queryUser, [windowId]);

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

    return res.status(200).json(formattedUsers);
  } catch (error) {
    console.log("Error in get all tickets ", error);
    return res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
};

export const getTicketInQueueWindow = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { windowId } = req.params;

    const queryUser = `
    SELECT users.id AS user_id, users.firstname, users.lastname, users.email,
          user_detailstb.id AS detail_id, user_detailstb.phone_number, user_detailstb.city, user_detailstb.age,
          window_tickettb.id AS ticket_id, window_tickettb.ticket_number, window_tickettb.status, window_tickettb.service_type
    FROM users
    INNER JOIN user_detailstb ON users.id = user_detailstb.user_id
    INNER JOIN window_tickettb ON users.id = window_tickettb.user_id
    WHERE window_tickettb.window_id = ? 
    AND window_tickettb.status NOT IN ('completed', 'void')
    AND DATE(issued_at) = CURDATE();
  `;

    const [rowsUser] = await connection.execute(queryUser, [windowId]);

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

    return res.status(200).json(formattedUsers);
  } catch (error) {
    console.log("Error in get Ticket In Queue Window ", error);
    return res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
};
