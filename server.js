const express = require("express");
const cors = require("cors");

const pool = require("./db.js"); 
const app = express();

app.use(cors());
app.use(express.json()); 

const PORT = process.env.PORT || 3000;

// rota para registrar presença por qr code ou manualmente
app.post("/api/presenca", (req, res) => {
  // atualizado: 'matricula' virou 'ra'
  const { ra, origem, id_aulas, presente } = req.body;

  // simula que salvou no banco de dados
  console.log(`Check-in recebido: RA ${ra} via ${origem}`);

  // retorna sucesso para o frontend
  return res.status(200).json({
    sucesso: true,
    mensagem: "Presença registrada com sucesso",
    aluno: "Nome simulado do aluno",
  });
});

// rota para buscar a frequencia de um aluno especifico
app.get("/api/frequencia/:ra", (req, res) => {
  // atualizado: ':matricula' virou ':ra'
  const { ra } = req.params;

  // retorna dados falsos so para testar
  return res.status(200).json({
    ra: ra,
    frequencia_geral: 85,
    total_faltas: 3,
    faltas_consecutivas: 0,
    status: "Regular",
  });
});

// rota para exibir frequência de todos os alunos (admin)
app.get("/api/admin/alunos", (req, res) => {
  return res.status(200).json([
    { id: "uuid-1", ra: "202601000", identidade: "Fulano Silva", frequencia: 85, status: "Regular" },
    { id: "uuid-2", ra: "202601001", identidade: "Ciclano Souza", frequencia: 92, status: "Regular" }
  ]);
});

// rota para registrar justificativa de falta
app.post("/api/justificativa", (req, res) => {
  const { id_presenca, motivo } = req.body;
  
  console.log(`Justificativa recebida para a presença ${id_presenca}`);
  return res.status(201).json({ 
    sucesso: true, 
    mensagem: "Justificativa enviada para análise da coordenação." 
  });
});

// devolve dados de queries mais complexas para os graficos do dashboard
app.get("/api/admin/estatisticas", (req, res) => {
  return res.status(200).json({
    total_alunos_ativos: 150,
    media_frequencia_geral: 78.5,
    alunos_em_alerta_evasao: 12
  });
});

// constroi o calendario visual de presencas/faltas de cada aluno
app.get("/api/frequencia/calendario/:ra", (req, res) => {
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

// lista todas as justificativas pendentes para a tela do admin
app.get("/api/admin/justificativas", (req, res) => {
  return res.status(200).json([
    { id: 1, id_presenca: 45, motivo: "Problema de saúde", aprovacao: "PENDENTE" },
    { id: 2, id_presenca: 89, motivo: "Atraso no transporte", aprovacao: "PENDENTE" }
  ]);
});

// altera o status_aprovacao de uma justificativa especifica
app.patch("/api/admin/justificativa/:id", (req, res) => {
  const { id } = req.params;
  const { aprovacao } = req.body; // espera o enum: APROVADO, REPROVADO
  
  return res.status(200).json({
    sucesso: true,
    mensagem: `Status da justificativa ${id} atualizado para ${aprovacao}`
  });
});

// atualiza os dados de um aluno especifico no banco
app.patch("/api/admin/aluno/:ra", (req, res) => {
  const { ra } = req.params;
  const updates = req.body;
  
  return res.status(200).json({
    sucesso: true,
    mensagem: `Dados do aluno com RA ${ra} atualizados com sucesso.`,
    dados_atualizados: updates
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});