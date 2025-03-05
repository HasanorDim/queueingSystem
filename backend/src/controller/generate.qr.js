import QRCode from "qrcode";
import pool from "../config/db.js";
import { fetchDepartment } from "../functions/fetchDepartment.js";

export const generateQR = async (req, res) => {
  const { departmentId } = req.params;

  if (!departmentId) {
    return res.status(400).json({ message: "Department ID is required" });
  }
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const qrData = `department_id=${departmentId}`;
    const qrCodeUrl = await QRCode.toDataURL(qrData);

    const query = "UPDATE departments SET qr_code = ? WHERE id = ?";
    await connection.query(query, [qrCodeUrl, departmentId]);

    const selectQuery = "SELECT * FROM departments WHERE id = ?";
    const [rows] = await connection.query(selectQuery, [departmentId]);

    await connection.commit();

    fetchDepartment(res);

    // res.status(200).json(response.data);
  } catch (err) {
    await connection.rollback();
    console.error("Error generating QR code:", err);
    res.status(500).json({ message: "Error generating QR code" });
  } finally {
    connection.release();
  }
};
