import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config(); // Load environment variables

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.HOST || "localhost",
  user: process.env.USER || "root",
  password: process.env.PASSWORD || "", // Empty password
  database: process.env.DATABASE || "DepartmentDB",
  waitForConnections: true,
  connectionLimit: 200, // Limit connections to 10
  queueLimit: 0,
});

console.log("Connected to MySQL Database ✅");

export default pool;

// db.connect((err) => {
//   if (err) {
//     console.error("Database Connection Failed:", err);
//   } else {
//     console.log("Connected to MySQL Database ✅");
//   }
// });

// if (err) {
//   console.error("Database Query Failed:", err);
//   res.status(500).send("Database Query Failed");
// } else {
//   console.log("User added successfully:", result);
//   res.status(200).send("User added successfully!");
// }
