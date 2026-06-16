const express = require("express");
const router = express.Router();
const pool = require("../../db.js");

// GET /api/admin/alunos - Lista frequência geral de todos os alunos
router.get("/alunos", async (req, res) => {
  return res.status(200).json([
    { id: "uuid-1", ra: "202601000", identidade: "Fulano Silva", frequencia: 85, status: "Regular" },
    { id: "uuid-2", ra: "202601001", identidade: "Ciclano Souza", frequencia: 92, status: "Regular" }
  ]);
});

// GET /api/admin/estatisticas - Dados consolidados para os gráficos do dashboard
router.get("/estatisticas", async (req, res) => {
  return res.status(200).json({
    total_alunos_ativos: 150,
    media_frequencia_geral: 78.5,
    alunos_em_alerta_evasao: 12
  });
});

// GET /api/admin/justificativas - Lista todas as justificativas pendentes
router.get("/justificativas", async (req, res) => {
  return res.status(200).json([
    { id: 1, id_presenca: 45, motivo: "Problema de saúde", aprovacao: "PENDENTE" },
    { id: 2, id_presenca: 89, motivo: "Atraso no transporte", aprovacao: "PENDENTE" }
  ]);
});

// PATCH /api/admin/justificativa/:id - Aprova ou reprova um atestado
router.patch("/justificativa/:id", async (req, res) => {
  const { id } = req.params;
  const { aprovacao } = req.body; // Espera 'APROVADO' ou 'REPROVADO'
  
  return res.status(200).json({
    sucesso: true,
    mensagem: `Status da justificativa ${id} atualizado para ${aprovacao}`
  });
});

// PATCH /api/admin/aluno/:ra - Atualiza dados ou status de matrícula do aluno
router.patch("/aluno/:ra", async (req, res) => {
  const { ra } = req.params;
  const updates = req.body;
  
  return res.status(200).json({
    sucesso: true,
    mensagem: `Dados do aluno com RA ${ra} atualizados com sucesso.`,
    dados_atualizados: updates
  });
});

module.exports = router;