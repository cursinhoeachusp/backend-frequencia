const express = require("express");
const router = express.Router();
const pool = require("../../db.js");

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("America/Sao_Paulo");

router.post("/", async (req, res) => {
  const { ra, origem } = req.body;
  
  try {
    const queryBuscaAluno = `
      SELECT a.id, a.id_user, u.raw_user_meta_data->>'name' AS nome
      FROM public.alunos a
      JOIN auth.users u ON a.id_user = u.id
      WHERE a.ra = $1;
    `;
    const resultBusca = await pool.query(queryBuscaAluno, [ra]);

    if (resultBusca.rows.length === 0) {
      return res.status(404).json({ erro: "Aluno não encontrado pelo RA informado." });
    }

    const aluno = resultBusca.rows[0];

    const dataHojeBR = dayjs().tz("America/Sao_Paulo").format("YYYY-MM-DD");

    const queryInsert = `
      INSERT INTO public.presencas (id_aluno, data_aula, status_presenca)
      VALUES ($1, $2, 'P');
    `;
    await pool.query(queryInsert, [aluno.id, dataHojeBR]);

    return res.status(200).json({
      sucesso: true,
      mensagem: "Presença registrada com sucesso",
      aluno: aluno.nome,
    });
  } catch (error) {
    console.error("Erro ao registrar presença:", error);
    res.status(500).json({ erro: "Erro interno ao registrar check-in" });
  }
});

module.exports = router;
