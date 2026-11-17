'use strict';

/*
 * movimentacao.js
 * Regras de entrada e saída de estoque e do histórico.
 * Para alterar a quantidade do produto, usa atualizarQuantidadeProduto (produtos.js).
 *
 * PADRÃO DE RETORNO (o mesmo do produtos.js):
 *   { sucesso: true,  erros: {},                   movimentacao: {...} }
 *   { sucesso: false, erros: { quantidade: 'msg' }, movimentacao: null  }
 * Chaves possíveis em "erros": produtoId, tipo, quantidade.
 */

const TIPOS_MOVIMENTACAO = {
  ENTRADA: 'entrada',
  SAIDA: 'saida'
};

// Quantas movimentações mostrar no histórico (as mais recentes).
const LIMITE_HISTORICO = 20;

/**
 * Valida os dados do formulário de movimentação.
 * Regras:
 *  - produtoId: obrigatório e o produto precisa existir (buscarProdutoPorId);
 *  - tipo: precisa ser um dos valores de TIPOS_MOVIMENTACAO;
 *  - quantidade: inteiro > 0 (usar converterParaInteiro);
 *  - saída não pode deixar o estoque negativo. Mensagem clara, por exemplo:
 *    "Quantidade indisponível. Há apenas 3 unidade(s) de Arroz 5kg em estoque."
 * @param {{produtoId: string, tipo: string, quantidade: string, observacao: string}} dados
 * @returns {{valido: boolean, erros: Object<string, string>}}
 */
function validarMovimentacao(dados) {
  // TODO (Fase 4)
  return { valido: false, erros: {} };
}

/**
 * Registra uma entrada ou saída.
 * Passos: validar -> calcular a nova quantidade -> atualizarQuantidadeProduto
 * -> montar o objeto do modelo (id, produtoId, tipo, quantidade, observacao com trim, data)
 * -> adicionar à lista -> salvarMovimentacoes.
 * @param {Object} dados Dados do formulário.
 * @returns {{sucesso: boolean, erros: Object, movimentacao: Object|null}}
 */
function registrarMovimentacao(dados) {
  // TODO (Fase 4)
  return { sucesso: false, erros: {}, movimentacao: null };
}

/**
 * Lista as movimentações da mais recente para a mais antiga,
 * limitadas a LIMITE_HISTORICO itens.
 * @returns {Array<Object>}
 */
function listarMovimentacoesRecentes() {
  // TODO (Fase 4)
  return [];
}

/**
 * Remove todas as movimentações de um produto.
 * Chamada pelo excluirProduto (produtos.js) para não deixar histórico "órfão".
 * @param {string} produtoId
 * @returns {boolean} true se salvou.
 */
function excluirMovimentacoesDoProduto(produtoId) {
  // TODO (Fase 3)
  return true;
}
