import pool from "../config/db.js";
// import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
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
  WHERE window_tickettb.window_id =?;
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

    console.log("");
    return res.status(200).json(formattedUsers);
  } catch (error) {
    console.log("Error in get all tickets ", error);
    return res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
};
