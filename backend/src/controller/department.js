import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid"; // For generating UUIDs
import { fetchDepartment } from "../functions/fetchDepartment.js";
import bcrypt from "bcryptjs";

export const getWindow = async (req, res) => {
  const { departmentId } = req.params;
  const connection = await pool.getConnection();
  try {
    const selectSql = "SELECT * FROM service_windowtb WHERE department_id =?";
    const [rows] = await connection.execute(selectSql, [departmentId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Department not found" });
    }

    const query = `
    SELECT d.*, sw.* 
    FROM service_windowtb sw
    INNER JOIN departments d ON d.id = sw.department_id
    WHERE d.id = ?;
  `;

    const [rows1] = await connection.execute(query, [departmentId]);

    const obg = {
      id: rows1[0].department_id,
      service_total: rows1[0].service_total || 0,
      name: rows1[0].name,
      description: rows1[0].description,
      status: rows1[0].status,
      qr_code: rows1[0].qr_code,
      created_at: rows1[0].created_at,
      window: rows1.map((item) => ({
        id: item.id,
        window_number: item.window_number,
        service_type: item.service_type,
      })),
    };

    return res.status(200).json(obg);
  } catch (error) {
    await connection.rollback(); // Rollback in case of error
    console.log("Error in getWindow ", error);
    return res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
};

export const addDepartment = async (req, res) => {
  const { name, description, counters } = req.body;

  const connection = await pool.getConnection();
  await connection.beginTransaction(); // Start a transaction
  try {
    // Step 1: Generate a UUID for the new department
    const departmentId = uuidv4();

    // Step 2: Insert the department with the pre-generated UUID
    const insertQuery = `
      INSERT INTO departments (id, name, description)
      VALUES (?, ?, ?)
    `;
    await connection.execute(insertQuery, [departmentId, name, description]);

    counters.map(async (item, index) => {
      const insertsql = `INSERT INTO service_windowtb (id, department_id, service_type, window_number)
        VALUES (?, ?, ?, ?)`;

      await connection.execute(insertsql, [
        item.id,
        departmentId,
        item.name,
        index + 1,
      ]);
    });

    // Step 3: Retrieve the inserted department using the UUID
    const selectQuery = `
      SELECT * FROM departments WHERE id = ?
    `;
    const [rows] = await connection.execute(selectQuery, [departmentId]);

    const insertedDepartment = rows[0];

    // Step 4: Commit the transaction
    await connection.commit();

    return res.status(201).json(insertedDepartment);
  } catch (error) {
    // Step 5: Rollback the transaction on error
    await connection.rollback();
    console.error("Error in adding department:", error);
    return res
      .status(500)
      .json({ message: "Internal server error in adding department" });
  } finally {
    // Step 6: Release the connection
    connection.release();
  }
};

export const editDepartment = async (req, res) => {
  const { id, name, description, counters } = req.body;

  const connection = await pool.getConnection();
  await connection.beginTransaction(); // Start a transaction

  try {
    if (id) {
      // ✅ Update the department
      const updateQuery = `
        UPDATE departments
        SET name = ?, description = ?
        WHERE id = ?
      `;
      await connection.execute(updateQuery, [name, description, id]);

      // ✅ Remove existing counters for this department (Optional: if you want to replace them)
      await connection.execute(
        `DELETE FROM service_windowtb WHERE department_id = ?`,
        [id]
      );

      // ✅ Insert updated counters
      if (counters && counters.length > 0) {
        const insertCounterQuery = `
          INSERT INTO service_windowtb (id, service_type, department_id, window_number) VALUES ?
        `;

        // Prepare counter values as an array of arrays
        const counterValues = counters.map((counter, index) => [
          counter.id,
          counter.name,
          id,
          index + 1,
        ]);

        await connection.query(insertCounterQuery, [counterValues]);
      }

      // ✅ Fetch updated department with counters
      const [updatedDepartment] = await connection.execute(
        "SELECT * FROM departments WHERE id = ?",
        [id]
      );

      // const [updatedCounters] = await connection.execute(
      //   "SELECT * FROM counter WHERE department_id = ?",
      //   [id]
      // );

      await connection.commit();
      return res.status(200).json({
        department: updatedDepartment[0],
        // counters: updatedCounters,
      });
    }
  } catch (error) {
    await connection.rollback();
    console.error("Error in editing department:", error);
    return res
      .status(500)
      .json({ message: "Internal server error in editing department" });
  } finally {
    connection.release();
  }
};

export const allDepartment = async (req, res) => {
  fetchDepartment(res);
};

export const getDepartment = async (req, res) => {
  const { departmentId } = req.params;
  const connection = await pool.getConnection();
  try {
    const selectQuery = `
      SELECT * FROM departments WHERE id =?
    `;
    const [rows] = await connection.execute(selectQuery, [departmentId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Department not found" });
    }
    return res.status(200).json(rows[0]);
  } catch (error) {
    await connection.rollback();
    console.error("Error in fetching department:", error);
    return res
      .status(500)
      .json({ message: "Internal server error in fetching department" });
  } finally {
    connection.release();
  }
};

export const deleteDepartment = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { departmentId } = req.params;

    const deleteQuery = `
      DELETE FROM departments WHERE id =?
    `;
    await connection.execute(deleteQuery, [departmentId]);

    await connection.commit();
    return res.status(204).json(); //204 means "No Content"
  } catch (error) {
    await connection.rollback();
    console.log("Error in delete Department", error);
    return res
      .status(500)
      .json({ message: "Internal server error in fetching department" });
  } finally {
    connection.release();
  }
};

export const setDepartmentUser = async (req, res) => {
  const { email, password, confirmpass } = req.body;
  const { departmentId } = req.params;

  if (!email || !password || !confirmpass)
    return res.status(400).json({ message: "All fields are required" });

  if (password !== confirmpass)
    return res.status(400).json({ message: "Passwords do not match" });

  if (password.length < 6)
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });

  const connection = await pool.getConnection();
  try {
    const id = uuidv4();

    const trimmedPassword = password.trim();

    // Hash the password before storing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(trimmedPassword, salt);

    const [existingUser] = await connection.execute(
      "SELECT id, password FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return { success: false, message: "Email already exists" };
    }

    // Insert user into MySQL database
    await connection.execute(
      "INSERT INTO users (id, email, password, role, department_id) VALUES (?, ?, ?, ?, ?)",
      [id, email, hashedPassword, "departmentadmin", departmentId]
    );

    // await connection.commit();
    return res.status(201).json(); //204 means "No Content"
  } catch (error) {
    await connection.rollback();
    console.log("Error in delete Department", error);
    return res
      .status(500)
      .json({ message: "Internal server error in fetching department" });
  } finally {
    connection.release();
  }
};
