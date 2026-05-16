require("dotenv").config(); // importa as variaveis do arquivo .env

const { Pool } = require("pg"); // importa o modulo Pool da biblioteca de conexao node-postgres

const pool = new Pool({
  // cria a conexao usando a url de acesso do NeonDB
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.connect((err, client, release) => {
  // tenta conectar com o NeonDB e imprime o erro, caso ocorra
  if (err) {
    return console.error("Erro ao concectar no banco de dados:", err.stack);
  }
  console.log("Tudo certo ao conectar com o banco de dados");
  release();
});

module.exports = pool;
