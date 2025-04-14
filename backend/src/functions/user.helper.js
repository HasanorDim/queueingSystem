import pool from "../config/db.js";

export const usersCounts = async () => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const query = `SELECT * FROM users WHERE role = 'client'`;
    const [rows] = await connection.execute(query);

    // Current date calculations
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Start of current week (Sunday)
    weekStart.setHours(0, 0, 0, 0);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1); // Start of current month

    // Filter users by time periods
    const todayTickets = rows.filter(
      (user) => new Date(user.created_at) >= todayStart
    );

    const weekTickets = rows.filter(
      (user) => new Date(user.created_at) >= weekStart
    );

    const monthTickets = rows.filter(
      (user) => new Date(user.created_at) >= monthStart
    );

    // Prepare the response object
    const result = {
      all: {
        count: rows.length,
      },
      week: {
        count: weekTickets.length,
      },
      month: {
        count: monthTickets.length,
      },
      rawData: rows, // Optional: include raw data if needed
    };

    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    return { success: false, message: error.message };
  } finally {
    connection.release();
  }
};
