import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
const request = require('supertest');
const express = require('express');
const frequenciasRoutes = require('./frequencias.routes');
const pool = require('../db');

const app = express();
app.use(express.json());
// Vamos montar a rota base como /frequencias
app.use('/frequencias', frequenciasRoutes);

describe('Testes da API de Frequências (Check-in)', () => {
  
  beforeEach(() => {
    vi.spyOn(pool, 'query');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Deve registrar a presença com sucesso (200)', async () => {
    const mockAlunoEncontrado = {
      rows: [{ id: 1, id_user: 'uuid-123', nome: 'Aluno Teste' }]
    };

    // 1ª Query: Busca o aluno (Retorna o aluno)
    pool.query.mockResolvedValueOnce(mockAlunoEncontrado);
    // 2ª Query: Insere a presença (Retorna sucesso)
    pool.query.mockResolvedValueOnce({ rowCount: 1 });

    const res = await request(app)
      .post('/frequencias')
      .send({ ra: '123456', origem: 'QR Code' });

    expect(res.status).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.aluno).toBe('Aluno Teste');
    
    // Verifica se a query de inserção foi chamada corretamente
    expect(pool.query).toHaveBeenCalledTimes(2);
  });

  it('Deve retornar 404 se o aluno não for encontrado pelo RA', async () => {
    // 1ª Query: Busca o aluno (Retorna vazio)
    pool.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app)
      .post('/frequencias')
      .send({ ra: 'RA_INEXISTENTE', origem: 'Manual' });

    expect(res.status).toBe(404);
    expect(res.body.erro).toBe('Aluno não encontrado pelo RA informado.');
    
    // Como falhou na busca, a segunda query (insert) não deve ser chamada
    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  it('Deve retornar 500 em caso de falha no banco de dados', async () => {
    // 1ª Query: Falha na conexão/execução
    pool.query.mockRejectedValueOnce(new Error('Erro de BD'));

    const res = await request(app)
      .post('/frequencias')
      .send({ ra: '123456', origem: 'QR Code' });

    expect(res.status).toBe(500);
    expect(res.body.erro).toBe('Erro interno ao registrar check-in');
  });
});