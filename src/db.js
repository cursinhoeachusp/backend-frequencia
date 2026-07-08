require("dotenv").config(); 

const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Erro ao concectar no banco de dados:", err.stack);
  }
  console.log("Tudo certo ao conectar com o banco de dados");
  release();
});

module.exports = pool;
