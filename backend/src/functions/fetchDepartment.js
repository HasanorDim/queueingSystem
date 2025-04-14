import pool from "../config/db.js";

export const fetchDepartment = async (res) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const selectQuery = `
        SELECT 
          d.id AS department_id, 
          d.name AS department_name, 
          d.description, 
          d.created_at,
          d.has_user,
          d.qr_code,
          c.id AS counter_id, 
          c.service_type AS counter_type
        FROM departments d
        LEFT JOIN service_windowtb c ON d.id = c.department_id;
      `;

    const [rows] = await connection.execute(selectQuery);

    // Process the result to group counters under their respective department
    const departments = rows.reduce((acc, row) => {
      const {
        department_id,
        department_name,
        description,
        created_at,
        counter_id,
        has_user,
        qr_code,
        counter_type,
      } = row;

      // Find if department already exists
      let department = acc.find((dept) => dept.id === department_id);
      if (!department) {
        department = {
          id: department_id,
          name: department_name,
          description,
          created_at,
          has_user,
          qr_code,
          counters: [], // Initialize empty array for counters
        };
        acc.push(department);
      }

      // Add counter if it exists
      if (counter_id) {
        department.counters.push({
          id: counter_id,
          name: counter_type,
        });
      }

      return acc;
    }, []);

    await connection.commit();
    return res.status(200).json(departments);
  } catch (error) {
    await connection.rollback();
    console.error("Error in fetching all departments with counters:", error);
    return res.status(500).json({
      message: "Internal server error in fetching data",
    });
  } finally {
    connection.release();
  }
};
