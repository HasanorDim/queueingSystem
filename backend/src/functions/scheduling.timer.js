import cron from "node-cron";
import pool from "../config/db.js";

// cron.schedule("*/1 * * * *", async () => {
//   const connection = await pool.getConnection();
//   try {
//     console.log("Checking for expired tickets...");

//     // Check if there are tickets that need to be voided
//     const checkQuery = `SELECT COUNT(*) AS count FROM window_tickettb WHERE status = 'On Hold' AND TIMESTAMPDIFF(SECOND, called_at, NOW()) >= 120`;
//     const [rows] = await connection.execute(checkQuery);
//     const count = rows[0].count;

//     if (count > 0) {
//       const updateQuery = `UPDATE window_tickettb SET status = 'void' WHERE status = 'On Hold' AND TIMESTAMPDIFF(SECOND, called_at, NOW()) >= 120`;
//       const [result] = await connection.execute(updateQuery);
//       console.log(`Voided ${result.affectedRows} expired tickets.`);
//     } else {
//       console.log("No expired tickets to void.");
//     }
//   } catch (error) {
//     console.error("Error voiding tickets:", error);
//   } finally {
//     connection.release();
//   }
// });
