import pool from "../config/db.js";

export const getAverageProcessTime = async (user) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    // 1. Get completed stats for today
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
              AND DATE(completed_at) = CURDATE()
              AND DATE(issued_at) = CURDATE()
              AND department_id = ?;
          `;

    // 2. Get total tickets created today
    const totalQuery = `
        SELECT COUNT(*) AS total_tickets_today
        FROM window_tickettb
        WHERE DATE(issued_at) = CURDATE()
        AND department_id = ?;
    `;

    const [statsRows] = await connection.execute(statsQuery, [
      user.department_id,
    ]);
    const [totalRows] = await connection.execute(totalQuery, [
      user.department_id,
    ]);

    await connection.commit();

    const result = statsRows[0];
    const totalToday = totalRows[0].total_tickets_today;
    const totalCompleted = result.total_completed;
    const metSLA = result.met_sla_count;
    const avgTime = result.avg_process_time;

    // Calculate SLA compliance percentage
    const slaCompliance =
      totalCompleted > 0
        ? parseFloat(((metSLA / totalCompleted) * 100).toFixed(2))
        : 0;

    // Determine trend based on SLA compliance (optional: could be customized)
    const trend =
      slaCompliance > 80 ? "up" : slaCompliance < 50 ? "down" : "stable";

    return {
      totalToday: totalToday,
      completed: totalCompleted,
      avgProcessTime: avgTime ? `${avgTime} min` : "N/A", // Ensure N/A when avgTime is null
      slaCompliance: `${slaCompliance} %`,
      metSlaCompliance: metSLA || 0,
      trend: trend,
    };
  } catch (err) {
    await connection.rollback();
    console.error("Error in getAverageProcessTime:", err);
    return { success: false, message: err.message };
  } finally {
    connection.release();
  }
};

export const getTicketStats = async (user) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const queryToday = `
        SELECT 
          COUNT(*) AS total_completed
        FROM 
          window_tickettb
        WHERE 
          status = 'completed'
          AND DATE(completed_at) = CURDATE()
          AND department_id = ?;
      `;

    const queryYesterday = `
        SELECT 
          COUNT(*) AS total_completed
        FROM 
          window_tickettb
        WHERE 
          status = 'completed'
          AND DATE(completed_at) = CURDATE() - INTERVAL 1 DAY
          AND department_id = ?;
      `;

    const [todayRows] = await connection.execute(queryToday, [
      user.department_id,
    ]);
    const [yesterdayRows] = await connection.execute(queryYesterday, [
      user.department_id,
    ]);

    await connection.commit();

    const todayCompleted = todayRows[0]?.total_completed || 0;
    const yesterdayCompleted = yesterdayRows[0]?.total_completed || 0;

    // Calculate percentage change
    const percentageChange =
      yesterdayCompleted > 0
        ? ((todayCompleted - yesterdayCompleted) / yesterdayCompleted) * 100
        : 0;

    // Determine the trend
    let trend = "flat"; // Default to flat if there's no change
    if (todayCompleted > yesterdayCompleted) {
      trend = "up"; // If today is greater than yesterday, trend is up
    } else if (todayCompleted < yesterdayCompleted) {
      trend = "down"; // If today is less than yesterday, trend is down
    }

    return {
      success: true,
      today: todayCompleted,
      yesterday: yesterdayCompleted,
      percentageChange: percentageChange.toFixed(1),
      trend, // round to 2 decimal places
    };
  } catch (err) {
    await connection.rollback();
    console.error("Error in getTicketStats:", err);
    return { success: false, message: err.message };
  } finally {
    connection.release();
  }
};

export const serviceDistribution = async (user) => {
  if (!user) return;

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const departmentId = user.department_id;

    // 1. Get all service windows for this department
    const query = `
        SELECT * FROM service_windowtb 
        WHERE department_id = ?
      `;
    const [windows] = await connection.execute(query, [departmentId]);

    if (!windows.length) return [];

    // 2. Get ticket counts for each window (grouped by service_type)
    const ticketQuery = `
        SELECT service_type, COUNT(*) as count
        FROM window_tickettb
        WHERE DATE(issued_at) = CURDATE() AND status IS NOT NULL AND department_id = ?
        GROUP BY service_type
      `;
    const [ticketCounts] = await connection.execute(ticketQuery, [
      departmentId,
    ]);

    // 3. Map service types to counts
    const countMap = {};
    let total = 0;
    for (const row of ticketCounts) {
      countMap[row.service_type] = row.count;
      total += row.count;
    }

    // 4. Format results per service window with color assignment
    const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

    const results = windows.map((window, index) => {
      const count = countMap[window.service_type] || 0;
      const percentage = total > 0 ? ((count / total) * 100).toFixed(2) : 0;

      return {
        success: true,
        id: window.id,
        name: window.service_type,
        count,
        agent: window.staff_name,
        percentage,
        color: colors[index % colors.length],
        trend: "stable",
      };
    });

    await connection.commit();
    return results;
  } catch (err) {
    await connection.rollback();
    console.error("Error in serviceDistribution:", err);
    return { success: false, message: err.message };
  } finally {
    connection.release();
  }
};

export const userInThisMonth = async () => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const query = ` 
          SELECT 
            id, 
            email, 
            firstname, 
            lastname, 
            created_at, 
            DATE(created_at) AS joined  /* Add this field to get the date without time */
          FROM users
          WHERE MONTH(created_at) = MONTH(CURRENT_DATE())
            AND YEAR(created_at) = YEAR(CURRENT_DATE())
            AND role = 'client'
        `;

    const [rows] = await connection.execute(query);
    await connection.commit();

    return {
      success: true,
      users: rows,
      count: rows.length,
    };
  } catch (err) {
    await connection.rollback();
    console.error("Error in userInThisMonth:", err);
    return { success: false, message: err.message };
  } finally {
    connection.release();
  }
};

//Super
export const getAverageProcessTimeSuper = async () => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    // 1. Get completed stats for today
    const statsQuery = `
          SELECT 
              COUNT(*) AS total_completed,
              SUM(met_sla = TRUE) AS met_sla_count
          FROM 
              window_tickettb
          WHERE 
              status = 'completed'
              AND called_at IS NOT NULL 
              AND completed_at IS NOT NULL
              AND DATE(completed_at) = CURDATE()
              AND DATE(issued_at) = CURDATE()
          `;

    // 2. Get total tickets created today
    const totalQuery = `
        SELECT COUNT(*) AS total_tickets_today
        FROM window_tickettb
        WHERE DATE(issued_at) = CURDATE()
    `;

    const [statsRows] = await connection.execute(statsQuery);
    const [totalRows] = await connection.execute(totalQuery);

    await connection.commit();

    const result = statsRows[0];
    const totalToday = totalRows[0].total_tickets_today;
    const totalCompleted = result.total_completed;
    const metSLA = result.met_sla_count;

    // Calculate SLA compliance percentage
    const slaCompliance =
      totalCompleted > 0
        ? parseFloat(((metSLA / totalCompleted) * 100).toFixed(2))
        : 0;

    // Determine trend based on SLA compliance (optional: could be customized)
    const trend =
      slaCompliance > 80 ? "up" : slaCompliance < 50 ? "down" : "stable";

    return {
      totalToday: totalToday,
      completed: totalCompleted,
      slaCompliance: `${slaCompliance} %`,
      metSlaCompliance: metSLA || 0,
      trend: trend,
    };
  } catch (err) {
    await connection.rollback();
    console.error("Error in getAverageProcessTime:", err);
    return { success: false, message: err.message };
  } finally {
    connection.release();
  }
};

export const getTicketStatsSuper = async () => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const queryToday = `
        SELECT 
          COUNT(*) AS total_completed
        FROM 
          window_tickettb
        WHERE 
          status = 'completed'
          AND DATE(completed_at) = CURDATE()
      `;

    const queryYesterday = `
        SELECT 
          COUNT(*) AS total_completed
        FROM 
          window_tickettb
        WHERE 
          status = 'completed'
          AND DATE(completed_at) = CURDATE() - INTERVAL 1 DAY
      `;

    const [todayRows] = await connection.execute(queryToday);
    const [yesterdayRows] = await connection.execute(queryYesterday);

    await connection.commit();

    const todayCompleted = todayRows[0]?.total_completed || 0;
    const yesterdayCompleted = yesterdayRows[0]?.total_completed || 0;

    // Calculate percentage change
    const percentageChange =
      yesterdayCompleted > 0
        ? ((todayCompleted - yesterdayCompleted) / yesterdayCompleted) * 100
        : 0;

    // Determine the trend
    let trend = "flat"; // Default to flat if there's no change
    if (todayCompleted > yesterdayCompleted) {
      trend = "up"; // If today is greater than yesterday, trend is up
    } else if (todayCompleted < yesterdayCompleted) {
      trend = "down"; // If today is less than yesterday, trend is down
    }

    return {
      success: true,
      today: todayCompleted,
      yesterday: yesterdayCompleted,
      percentageChange: percentageChange.toFixed(1),
      trend, // round to 2 decimal places
    };
  } catch (err) {
    await connection.rollback();
    console.error("Error in getTicketStats:", err);
    return { success: false, message: err.message };
  } finally {
    connection.release();
  }
};

export const serviceDistributionSuper = async () => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    // 1. Get all service windows for this department
    const query = `
        SELECT * FROM service_windowtb 
      `;
    const [windows] = await connection.execute(query);

    if (!windows.length) return [];

    // 2. Get ticket counts for each window (grouped by service_type)
    const ticketQuery = `
        SELECT service_type, COUNT(*) as count
        FROM window_tickettb
        WHERE DATE(issued_at) = CURDATE() AND status IS NOT NULL
        GROUP BY service_type
      `;
    const [ticketCounts] = await connection.execute(ticketQuery);

    // 3. Map service types to counts
    const countMap = {};
    let total = 0;
    for (const row of ticketCounts) {
      countMap[row.service_type] = row.count;
      total += row.count;
    }

    // 4. Format results per service window with color assignment
    const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

    const results = windows.map((window, index) => {
      const count = countMap[window.service_type] || 0;
      const percentage = total > 0 ? ((count / total) * 100).toFixed(2) : 0;

      return {
        success: true,
        id: window.id,
        name: window.service_type,
        count,
        agent: window.staff_name,
        percentage,
        color: colors[index % colors.length],
        trend: "stable",
      };
    });

    await connection.commit();
    return results;
  } catch (err) {
    await connection.rollback();
    console.error("Error in serviceDistribution:", err);
    return { success: false, message: err.message };
  } finally {
    connection.release();
  }
};

export const departmentAnalyticsSuper = async () => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const [departments] = await connection.execute("SELECT * FROM departments");

    const dateTicketCounts = async (dateCondition) => {
      const query = `
        SELECT d.id AS department_id, COUNT(t.id) AS ticket_count
        FROM window_tickettb t
        JOIN departments d ON t.department_id = d.id
        WHERE ${dateCondition} AND t.status IS NOT NULL
        GROUP BY d.id
      `;
      const [rows] = await connection.execute(query);
      return rows.reduce((acc, row) => {
        acc[row.department_id] = row.ticket_count;
        return acc;
      }, {});
    };

    const todayCounts = await dateTicketCounts("DATE(t.issued_at) = CURDATE()");
    const yesterdayCounts = await dateTicketCounts(
      "DATE(t.issued_at) = CURDATE() - INTERVAL 1 DAY"
    );

    const totalToday = Object.values(todayCounts).reduce(
      (sum, count) => sum + count,
      0
    );

    const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];
    const results = departments.map((dep, index) => {
      const todayCount = todayCounts[dep.id] || 0;
      const yesterdayCount = yesterdayCounts[dep.id] || 0;

      const percentage =
        totalToday > 0 ? ((todayCount / totalToday) * 100).toFixed(2) : 0;
      const change =
        yesterdayCount === 0
          ? todayCount > 0
            ? 100
            : 0
          : (((todayCount - yesterdayCount) / yesterdayCount) * 100).toFixed(2);

      let trend = "stable";
      if (change > 0) trend = "up";
      else if (change < 0) trend = "down";

      return {
        id: dep.id,
        name: dep.name,
        count: todayCount,
        percentage,
        percentageChange: parseFloat(change),
        trend,
        color: colors[index % colors.length],
      };
    });

    await connection.commit();
    return results;
  } catch (err) {
    await connection.rollback();
    console.error("Error in departmentAnalyticsSuper:", err);
    return { success: false, message: err.message };
  } finally {
    connection.release();
  }
};
