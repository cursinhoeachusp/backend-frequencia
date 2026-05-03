const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // permite receber dados em JSON

const PORT = process.env.PORT || 3000;

// rota para registrar presença por qr code ou manualmente

app.post('/api/presenca', (req, res) => {
    const {matricula, origem} = req.body;

    // simula que salvou no banco de dados 
    console.log(`Check-in recebido: matricula ${matricula} via ${origem}`);   


    // Retorna sucesso para o frontend 
    return res.status(200).json({
        sucesso: true,
        mensagem: "Presença registrada com sucesso",
        aluno: "Nome simulado do aluno"
    });

});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});