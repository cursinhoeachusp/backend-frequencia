const express = require("express");
const cors = require("cors");

const presencaRoutes = require("./src/routes/presenca.routes.js");
const adminRoutes = require("./src/routes/admin.routes.js");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", presencaRoutes);
app.use("/api/admin", adminRoutes); 

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando lindamente na porta ${PORT}`);
});