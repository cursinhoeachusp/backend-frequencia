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

## Regras de Negócio Implementadas

* **Timezone Fixo:** Toda a manipulação de datas da API força o fuso horário `America/Sao_Paulo`, garantindo que registros noturnos não saltem de dia devido ao fuso UTC do servidor em nuvem.
* **Semana Letiva Acadêmica:** O cálculo de faltas semanais foi adaptado para iniciar estritamente na **Segunda-feira** (alinhado ao calendário do cursinho), sobrepondo o comportamento padrão americano que inicia no Domingo.
* **Consistência de Dados (Transações):** A aprovação de uma justificativa de falta altera atomicamente o status do atestado e modifica o histórico de presenças do respectivo dia de `'F'` (Falta) para `'J'` (Justificada) usando blocos `BEGIN/COMMIT`.
* **Tratamento de Matrícula:** Ao marcar um aluno como 'Regular', o campo `data_evasao` é resetado para `NULL`. Ao marcar como 'Evadido', grava-se automaticamente a data atual do servidor.

---

## Como rodar o projeto localmente

### 1. Clone o repositório
```bash
git clone [https://github.com/cursinhoeachusp/backend-frequencia](https://github.com/cursinhoeachusp/backend-frequencia)
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
