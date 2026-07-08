const express = require("express");
const router = express.Router();
const pool = require("../../db.js");

const dayjs = require("dayjs");
const isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);

dayjs.tz.setDefault("America/Sao_Paulo");

router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT 
        j.id, 
        a.ra, 
        u.raw_user_meta_data->>'name' AS nome,
        p.data_aula, 
        j.motivo, 
        j.status_analise
      FROM public.justificativas j
      JOIN public.presencas p ON j.id_presenca = p.id
      JOIN public.alunos a ON p.id_aluno = a.id
      JOIN auth.users u ON a.id_user = u.id
      WHERE j.status_analise = 'Pendente';
    `;
    const { rows } = await pool.query(query);

    const response = rows.map(r => ({
      id: r.id,
      ra: r.ra,
      nome: r.nome,
      dataFalta: dayjs(r.data_aula).format("DD/MM/YYYY"),
      motivo: r.motivo,
      statusAnalise: r.status_analise
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error("Erro ao listar justificativas:", error);
    res.status(500).json({ erro: "Falha ao buscar justificativas" });
  }
});

router.patch("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { statusAnalise } = req.body; 

  try {
    await pool.query('BEGIN');

    const queryJustificativa = `
      UPDATE public.justificativas 
      SET status_analise = $1 
      WHERE id = $2 
      RETURNING id_presenca;
    `;
    const resultJustificativa = await pool.query(queryJustificativa, [statusAnalise, id]);

    if (statusAnalise === 'Aprovada' && resultJustificativa.rows.length > 0) {
      const idPresenca = resultJustificativa.rows[0].id_presenca;
      await pool.query(
        `UPDATE public.presencas SET status_presenca = 'J' WHERE id = $1`, 
        [idPresenca]
      );
    }

    await pool.query('COMMIT');
    res.status(200).json({ sucesso: true, mensagem: "Justificativa processada com sucesso." });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error("Erro ao aprovar justificativa:", error);
    res.status(500).json({ erro: "Falha ao processar justificativa" });
  }
});

module.exports = router;