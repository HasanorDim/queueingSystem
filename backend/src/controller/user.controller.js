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

export const getBreakTime = async (req, res) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const selectQuery = "SELECT * FROM toggletb";
    const [rows] = await connection.execute(selectQuery);

    const result = rows[0].isBreakTime;
    await connection.commit();

    return res.status(200).json({ result });
  } catch (error) {
    await connection.rollback();
    console.log("Error in all users: ", error);
    return res.status(500).json({ message: "Error in fetching all users" });
  } finally {
    connection.release();
  }
};

export const setBreakTime = async (req, res) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const selectQuery = "SELECT * FROM toggletb";
    const [rows] = await connection.execute(selectQuery);

    const data = rows[0];
    const dataId = rows[0].id;

    const updateQuery = `Update toggletb set isBreakTime = ? WHERE id = ?`;

    await connection.execute(updateQuery, [!data.isBreakTime, dataId]);

    const [updatedRows] = await connection.execute(selectQuery);

    const result = updatedRows[0].isBreakTime;

    await connection.commit();

    return res.status(200).json({ result });
  } catch (error) {
    await connection.rollback();
    console.log("Error in all users: ", error);
    return res.status(500).json({ message: "Error in fetching all users" });
  } finally {
    connection.release();
  }
};

export const setCutOff = async (req, res) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const selectQuery = "SELECT * FROM toggletb";
    const [rows] = await connection.execute(selectQuery);

    const data = rows[0];
    const dataId = rows[0].id;

    const updateQuery = `Update toggletb set isCutOff = ? WHERE id = ?`;

    await connection.execute(updateQuery, [!data.isCutOff, dataId]);

    const [updatedRows] = await connection.execute(selectQuery);

    const result = updatedRows[0].isCutOff;

    await connection.commit();

    return res.status(200).json({ result });
  } catch (error) {
    await connection.rollback();
    console.log("Error in all users: ", error);
    return res.status(500).json({ message: "Error in fetching all users" });
  } finally {
    connection.release();
  }
};

export const getCutOff = async (req, res) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const selectQuery = "SELECT * FROM toggletb";
    const [rows] = await connection.execute(selectQuery);

    const result = rows[0].isCutOff;
    await connection.commit();

    return res.status(200).json({ result });
  } catch (error) {
    await connection.rollback();
    console.log("Error in all users: ", error);
    return res.status(500).json({ message: "Error in fetching all users" });
  } finally {
    connection.release();
  }
};
