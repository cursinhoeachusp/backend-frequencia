# Backend Frequência

Repositório responsável pela API do Sistema de Coleta de Frequência do Cursinho Popular EACH (CPE). Este sistema integra a carteirinha virtual dos alunos ao banco de dados para automatizar o controle de presença e monitorar indicadores de evasão.

---

## Visão Geral

- **Objetivo:** Substituir as planilhas manuais por um sistema automatizado via QR Code ou RA.  
- **Público:** Voluntários do balcão (registro) e alunos (consulta de frequência).  

---

## Tecnologias Utilizadas

- **Runtime:** Node.js  
- **Framework:** Express  
- **Banco de Dados:** PostgreSQL (NeonDB) — Conexão prevista para a Semana 3  
- **Deploy:** Render  

---

## Como rodar o projeto localmente

### 1. Clone o repositório
```bash
git clone https://github.com/inovatec-each/backend-frequencia.git
cd backend-frequencia
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo .env na raiz do projeto e adicione:

```bash
PORT=3000
```
(Futuramente) adicionar a URL de conexão do NeonDB

### 4. Inicie o servidor

```bash
node server.js
```
