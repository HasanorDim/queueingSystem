import pool from "../config/db.js";

export const departmentCount = async () => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const selectQuery = `
    SELECT 
      COUNT(*) as window_count
    FROM service_windowtb 
  `;
    const [rows] = await connection.execute(selectQuery);
    const window_count = rows[0].window_count;
    return window_count;
  } catch (error) {
    await connection.rollback();
    return { success: false, message: error.message };
  } finally {
    connection.release();
  }
};

export const allTicketsCount = async () => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const query = `SELECT * FROM window_tickettb`;
    const [rows] = await connection.execute(query);

    // Current date calculations
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Start of current week (Sunday)
    weekStart.setHours(0, 0, 0, 0);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1); // Start of current month

    // Filter tickets by time periods
    const todayTickets = rows.filter(
      (ticket) => new Date(ticket.issued_at) >= todayStart
    );

    const weekTickets = rows.filter(
      (ticket) => new Date(ticket.issued_at) >= weekStart
    );

    const monthTickets = rows.filter(
      (ticket) => new Date(ticket.issued_at) >= monthStart
    );

    // Count by status for each period
    const countByStatus = (tickets) => {
      return tickets.reduce((acc, ticket) => {
        acc[ticket.status] = (acc[ticket.status] || 0) + 1;
        return acc;
      }, {});
    };

    // Prepare the response object
    const result = {
      all: {
        count: rows.length,
        byStatus: countByStatus(rows),
      },
      today: {
        count: todayTickets.length,
        byStatus: countByStatus(todayTickets),
      },
      week: {
        count: weekTickets.length,
        byStatus: countByStatus(weekTickets),
      },
      month: {
        count: monthTickets.length,
        byStatus: countByStatus(monthTickets),
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

export const getAverageProcessTime = async () => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    // SQL query to get data for this month and last month
    const statsQuery = `
          SELECT 
            COUNT(*) AS total_completed,
            SUM(met_sla = TRUE) AS met_sla_count,
            ROUND(AVG(TIMESTAMPDIFF(MINUTE, called_at, completed_at)), 2) AS avg_process_time
          FROM 
            window_tickettb
          WHERE 
            status = 'completed'
            AND called_at IS NOT NULL 
            AND completed_at IS NOT NULL
            AND MONTH(completed_at) = MONTH(CURDATE())
            AND YEAR(completed_at) = YEAR(CURDATE())
            AND MONTH(issued_at) = MONTH(CURDATE())
            AND YEAR(issued_at) = YEAR(CURDATE());
      `;

    const [statsRows] = await connection.execute(statsQuery);

    // Get the result for this month's stats
    const result = statsRows[0];

    // Calculate the percentage of SLA compliance for this month
    const metSlaPercentage = result.total_completed
      ? (result.met_sla_count / result.total_completed) * 100
      : 0;

    // Get data for last month to calculate trend
    const lastMonthQuery = `
          SELECT 
            COUNT(*) AS total_completed_last_month,
            SUM(met_sla = TRUE) AS met_sla_count_last_month
          FROM 
            window_tickettb
          WHERE 
            status = 'completed'
            AND called_at IS NOT NULL 
            AND completed_at IS NOT NULL
            AND MONTH(completed_at) = MONTH(CURDATE()) - 1
            AND YEAR(completed_at) = YEAR(CURDATE())
            AND MONTH(issued_at) = MONTH(CURDATE()) - 1
            AND YEAR(issued_at) = YEAR(CURDATE());
      `;

    const [lastMonthRows] = await connection.execute(lastMonthQuery);
    const lastMonthResult = lastMonthRows[0];

    // Calculate last month's SLA compliance percentage
    const lastMonthSlaPercentage = lastMonthResult.total_completed_last_month
      ? (lastMonthResult.met_sla_count_last_month /
          lastMonthResult.total_completed_last_month) *
        100
      : 0;

    // Determine the trend based on comparison with last month's SLA percentage
    let trend = "stable";
    if (metSlaPercentage > lastMonthSlaPercentage) {
      trend = "up"; // Improved performance this month
    } else if (metSlaPercentage < lastMonthSlaPercentage) {
      trend = "down"; // Decline in performance this month
    }

    await connection.commit();

    return {
      success: true,
      total_completed: result.total_completed,
      met_sla_count: result.met_sla_count,
      avg_process_time: result.avg_process_time ?? null,
      met_sla_percentage: metSlaPercentage.toFixed(2), // Round to 2 decimal places
      trend,
      lastMonthSlaPercentage: lastMonthSlaPercentage.toFixed(2), // Round to 2 decimal places
    };
  } catch (err) {
    await connection.rollback();
    console.error("Error in getAverageProcessTime:", err);
    return { success: false, message: err.message };
  } finally {
    connection.release();
  }
};
