# Backend Frequência

Repositório responsável pela API REST do Sistema de Coleta de Frequência do Cursinho Popular EACH (CPE). Este sistema integra a carteirinha virtual dos alunos ao banco de dados central para automatizar o controle de presença, gerenciar justificativas de faltas e monitorar indicadores de evasão escolar.

---

## Visão Geral

- **Objetivo:** Substituir as planilhas manuais de chamada por um ecossistema automatizado via leitura de QR Code ou digitação de RA.
- **Público:** Coordenadores/Administradores do cursinho (gestão de prontuários e atestados) e Voluntários do balcão (registro de check-in).

---

## Tecnologias Utilizadas

- **Runtime:** Node.js
- **Framework Web:** Express
- **Banco de Dados:** PostgreSQL (Gerenciado via Supabase)
- **Manipulação de Datas:** Day.js (com plugins `utc` e `timezone`) para blindagem contra anomalias de fuso horário em servidores Cloud.
- **Drivers & Segurança:** `pg` (Pool de conexões parametrizadas contra SQL Injection).

---

## Como rodar o projeto localmente

### 1. Clone o repositório
```bash
git clone https://github.com/cursinhoeachusp/backend-frequencia
cd backend-frequencia
```

### 2. Instale as dependências
``` bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo .env na raiz do projeto e preencha com as credenciais fornecidas pela equipe de Inovação & Tecnologia:
```bash
PORT=3000
DATABASE_URL=postgresql://postgres:[PASSWORD]@******:5432/postgres
```

### 4. Inicie o servidor em ambiente de desenvolvimento
``` bash
node server.js
```
