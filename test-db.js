import pool from "./db.js";

async function testConnection() {
  try {
    const result = await pool.query("SELECT NOW()");

    console.log("PostgreSQL bilan aloqa muvaffaqiyatli!");
    console.log(result.rows[0]);

  } catch (error) {
    console.log("Ulanishda xatolik:", error.message);

  } finally {
    await pool.end();
  }
}

testConnection();