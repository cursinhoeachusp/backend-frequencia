const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // permite receber dados em JSON

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});