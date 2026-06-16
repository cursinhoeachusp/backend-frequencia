const express = require("express");
const router = express.Router();
const pool = require("../../db.js");

// POST /api/presenca - Coleta a frequência do aluno
router.post("/presenca", async (req, res) => {
  const { ra, origem, id_aulas, presente } = req.body;
  
  try {
    console.log(`[Mock] Check-in recebido para o RA: ${ra} via ${origem}`);
    
    // MOCK: Retorno temporário até plugar o Supabase
    return res.status(200).json({
      sucesso: true,
      mensagem: "Presença registrada com sucesso (Mock)",
      aluno: "Nome simulado do aluno",
    });
  } catch (error) {
    console.error("Erro na rota de presença:", error);
    res.status(500).json({ erro: "Erro interno no servidor" });
  }
});

// GET /api/frequencia/:ra - Busca a frequência de um aluno específico (Carteirinha)
router.get("/frequencia/:ra", async (req, res) => {
  const { ra } = req.params;
  
  try {
    return res.status(200).json({
      ra: ra,
      frequencia_geral: 85,
      total_faltas: 3,
      faltas_consecutivas: 0,
      status: "Regular",
    });
  } catch (error) {
    console.error("Erro ao buscar frequência:", error);
    res.status(500).json({ erro: "Erro interno no servidor" });
  }
});

// GET /api/frequencia/calendario/:ra - Calendário visual do aluno
router.get("/frequencia/calendario/:ra", async (req, res) => {
  const { ra } = req.params;
  return res.status(200).json({
    ra: ra,
    calendario: [
      { data: "2026-06-08", presente: true },
      { data: "2026-06-09", presente: false },
      { data: "2026-06-10", presente: true }
    ]
  });
});

// POST /api/justificativa - Envia uma justificativa de falta
router.post("/justificativa", async (req, res) => {
  const { id_presenca, motivo } = req.body;
  return res.status(201).json({ 
    sucesso: true, 
    mensagem: "Justificativa enviada para análise da coordenação (Mock)." 
  });
});

module.exports = router;