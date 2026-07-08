const express = require("express");
const cors = require("cors");


const alunosRoutes = require("./routes/alunos.routes.js");
const estatisticasRoutes = require("./routes/estatisticas.routes.js");
const frequenciasRoutes = require("./routes/frequencias.routes.js");
const justificativasRoutes = require("./routes/justificativas.routes.js");

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/alunos", alunosRoutes);
app.use("/api/estatisticas", estatisticasRoutes);
app.use("/api/frequencias", frequenciasRoutes);
app.use("/api/justificativas", justificativasRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando lindamente na porta ${PORT}`);
});