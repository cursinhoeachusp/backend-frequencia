import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
const request = require('supertest');
const express = require('express');
const alunosRoutes = require('./alunos.routes');
const pool = require('../db');

// Cria uma mini-instância do app Express para testar a rota
const app = express();
app.use(express.json());
app.use('/alunos', alunosRoutes);

describe('Testes da API de Alunos (Frequência)', () => {
  
  beforeEach(() => {
    // Espiona as chamadas ao banco de dados
    vi.spyOn(pool, 'query');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ==========================================
  // GET /alunos
  // ==========================================
  describe('GET /alunos', () => {
    
    it('Deve retornar a lista de alunos com os cálculos de frequência corretos (200)', async () => {
      // 1. Simula o retorno da primeira query (Alunos)
      const mockAlunos = {
        rows: [
          { id: 1, ra: '123456', status: 'Regular', nome: 'João Silva' }
        ]
      };

      // 2. Simula o retorno da segunda query (Histórico de Presenças)
      const mockPresencas = {
        rows: [
          { id_aluno: 1, data_aula: '2023-10-01', status: 'P' }, // Presença
          { id_aluno: 1, data_aula: '2023-10-02', status: 'F' }, // Falta
          { id_aluno: 1, data_aula: '2023-10-03', status: 'J' }, // Justificativa
          { id_aluno: 1, data_aula: '2023-10-04', status: 'F' }  // Falta
        ]
      };

      // Encadeia os retornos falsos do banco de dados na ordem em que são chamados
      pool.query
        .mockResolvedValueOnce(mockAlunos)
        .mockResolvedValueOnce(mockPresencas);

      const res = await request(app).get('/alunos');

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      
      const aluno = res.body[0];
      expect(aluno.ra).toBe('123456');
      expect(aluno.nome).toBe('João Silva');
      expect(aluno.status).toBe('Regular');
      
      // Validação do Cálculo de Frequência: 
      // 4 aulas totais. Garantidos: 1(P) + 1(J) = 2. 
      // Frequência esperada = (2 / 4) * 100 = 50%
      expect(aluno.frequencia).toBe(50);
      
      // Validação de Faltas Consecutivas:
      // A última é F (1), a penúltima é J (quebra a sequência). Total = 1
      expect(aluno.faltasConsecutivas).toBe(1);
    });

    it('Deve retornar frequência 0% se o aluno não tiver nenhuma aula no histórico', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ id: 2, ra: '999', status: 'Regular', nome: 'Maria' }] })
        .mockResolvedValueOnce({ rows: [] }); // Nenhuma presença cadastrada

      const res = await request(app).get('/alunos');
      expect(res.status).toBe(200);
      expect(res.body[0].frequencia).toBe(0);
    });

    it('Deve retornar status 500 em caso de erro no banco de dados', async () => {
      pool.query.mockRejectedValueOnce(new Error('Erro de conexão com o Supabase'));

      const res = await request(app).get('/alunos');

      expect(res.status).toBe(500);
      expect(res.body.erro).toBe('Falha ao buscar dados dos alunos');
    });
  });

  // ==========================================
  // PATCH /alunos/:ra/status-historico
  // ==========================================
  describe('PATCH /alunos/:ra/status-historico', () => {
    
    it('Deve atualizar o status para Regular com sucesso (200)', async () => {
      pool.query.mockResolvedValueOnce({ rowCount: 1 });

      const res = await request(app)
        .patch('/alunos/123456/status-historico')
        .send({ status: 'Regular' });

      expect(res.status).toBe(200);
      expect(res.body.mensagem).toBe('Prontuário atualizado.');
      
      // Valida se a query do banco foi chamada corretamente 
      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String), // A query SQL
        ['Regular', '123456'] // Os parâmetros corrigidos
      );
    });

    it('Deve atualizar o status para Evadido e salvar a data com sucesso (200)', async () => {
      pool.query.mockResolvedValueOnce({ rowCount: 1 });

      const res = await request(app)
        .patch('/alunos/123456/status-historico')
        .send({ status: 'Evadido' });

      expect(res.status).toBe(200);
      
      // Valida se o banco recebeu a data como 3º parâmetro
      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String), 
        ['Evadido', '123456', expect.any(String)] // A string é a data gerada pelo Day.js
      );
    });

    it('Deve retornar 500 se o banco falhar na atualização', async () => {
      pool.query.mockRejectedValueOnce(new Error('Falha no update'));

      const res = await request(app)
        .patch('/alunos/123456/status-historico')
        .send({ status: 'Regular' });

      expect(res.status).toBe(500);
      expect(res.body.erro).toBe('Falha ao atualizar dados do aluno');
    });
  });

});