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
  const erros = {};
  const produtoId = String(dados?.produtoId ?? '').trim();
  const tipo = String(dados?.tipo ?? '').trim();
  const quantidade = converterParaInteiro(dados?.quantidade);

  let produto = null;
  if (!produtoId) {
    erros.produtoId = 'Selecione um produto.';
  } else {
    produto = buscarProdutoPorId(produtoId);
    if (!produto) {
      erros.produtoId = 'Produto não encontrado.';
    }
  }

  const tiposValidos = Object.values(TIPOS_MOVIMENTACAO);
  if (!tiposValidos.includes(tipo)) {
    erros.tipo = 'Selecione um tipo de movimentação válido.';
  }

  if (Number.isNaN(quantidade) || quantidade <= 0) {
    erros.quantidade = 'Informe uma quantidade inteira maior que zero.';
  } else if (
    produto &&
    tipo === TIPOS_MOVIMENTACAO.SAIDA &&
    quantidade > produto.quantidade
  ) {
    erros.quantidade = `Quantidade indisponível. Há apenas ${produto.quantidade} unidade(s) de ${produto.nome} em estoque.`;
  }

  return {
    valido: Object.keys(erros).length === 0,
    erros
  };
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
  const validacao = validarMovimentacao(dados);
  if (!validacao.valido) {
    return {
      sucesso: false,
      erros: validacao.erros,
      movimentacao: null
    };
  }

  const produtoId = String(dados.produtoId).trim();
  const tipo = String(dados.tipo).trim();
  const quantidade = converterParaInteiro(dados.quantidade);
  const observacao = String(dados.observacao ?? '').trim();

  const produto = buscarProdutoPorId(produtoId);
  if (!produto) {
    return {
      sucesso: false,
      erros: { produtoId: 'Produto não encontrado.' },
      movimentacao: null
    };
  }

  const novaQuantidade =
    tipo === TIPOS_MOVIMENTACAO.ENTRADA
      ? produto.quantidade + quantidade
      : produto.quantidade - quantidade;

  const produtoAtualizado = atualizarQuantidadeProduto(produtoId, novaQuantidade);
  if (!produtoAtualizado) {
    return {
      sucesso: false,
      erros: { quantidade: 'Não foi possível atualizar a quantidade do produto.' },
      movimentacao: null
    };
  }

  const movimentacao = {
    id: gerarId(),
    produtoId,
    tipo,
    quantidade,
    observacao,
    data: obterDataAtualIso()
  };

  const movimentacoes = carregarMovimentacoes();
  movimentacoes.push(movimentacao);

  const salvou = salvarMovimentacoes(movimentacoes);
  if (!salvou) {
    atualizarQuantidadeProduto(produtoId, produto.quantidade);
    return {
      sucesso: false,
      erros: { quantidade: 'Não foi possível salvar a movimentação no navegador.' },
      movimentacao: null
    };
  }

  return {
    sucesso: true,
    erros: {},
    movimentacao
  };
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
