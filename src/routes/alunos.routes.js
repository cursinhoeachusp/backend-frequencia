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
    const queryAlunos = `
      SELECT 
        a.id, 
        a.ra, 
        a.status_matricula AS status,
        u.raw_user_meta_data->>'name' AS nome
      FROM public.alunos a
      JOIN auth.users u ON a.id_user = u.id;
    `;
    const { rows: alunos } = await pool.query(queryAlunos);

    const queryPresencas = `
      SELECT id_aluno, data_aula, status_presenca AS status
      FROM public.presencas
      ORDER BY data_aula ASC;
    `;
    const { rows: todasPresencas } = await pool.query(queryPresencas);

    const inicioDaSemana = dayjs().tz("America/Sao_Paulo").startOf("week").add(1, "day");

    const resultadoFinal = alunos.map(aluno => {
      const historico = todasPresencas.filter(p => p.id_aluno === aluno.id);
      
      const totalAulas = historico.length;
      const diasGarantidos = historico.filter(
        (registro) => registro.status === 'P' || registro.status === 'J'
      ).length;
      const frequencia = totalAulas === 0 
        ? 0 
        : Math.round((diasGarantidos / totalAulas) * 100);
 
      let faltasConsecutivas = 0;
      for (let i = historico.length - 1; i >= 0; i--) {
        if (historico[i].status === 'F') {
          faltasConsecutivas++;
        } else {
          break; 
        }
      }

        const faltasNaSemana = historico.filter((registro) => {
        const dataRegistro = new Date(registro.data_aula);
        const ehFalta = registro.status === 'F';
        const ehDestaSemana = dayjs(registro.data_aula).tz("America/Sao_Paulo").isSameOrAfter(inicioDaSemana);
        return ehFalta && ehDestaSemana;
      }).length;

      return {
        ra: aluno.ra,
        nome: aluno.nome,
        frequencia,
        status: aluno.status,
        faltasConsecutivas,
        faltasNaSemana,
        historico: historico.map(h => ({ 
          dia: dayjs(h.data_aula).date(), 
          status: h.status 
        }))
      };
    });

    res.status(200).json(resultadoFinal);
  } catch (error) {
    console.error("Erro ao listar alunos:", error);
    res.status(500).json({ erro: "Falha ao buscar dados dos alunos" });
  }
});

router.patch("/:ra/status-historico", async (req, res) => {
  const { ra } = req.params;
  const { status } = req.body; 

  try {
    let dataEvasaoDefinicao = "data_evasao"; 
    
    if (status === 'Regular') {
      dataEvasaoDefinicao = "NULL";
    } else if (status === 'Evadido') {
      dataEvasaoDefinicao = "$3";
      params.push(dayjs().tz("America/Sao_Paulo").format("YYYY-MM-DD"));
    }

    const queryUpdate = `
      UPDATE public.alunos 
      SET 
        status_matricula = $1, 
        data_evasao = ${dataEvasaoDefinicao}
      WHERE ra = $2;
    `;
    await pool.query(queryUpdate, [status, ra]);

    res.status(200).json({ sucesso: true, mensagem: "Prontuário atualizado." });
  } catch (error) {
    console.error("Erro ao atualizar aluno:", error);
    res.status(500).json({ erro: "Falha ao atualizar dados do aluno" });
  }
});

module.exports = router;