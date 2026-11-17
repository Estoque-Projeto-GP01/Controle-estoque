'use strict';

/*
 * storage.js
 * ÚNICA camada que acessa o LocalStorage. Os outros arquivos chamam estas
 * funções e nunca usam localStorage diretamente. Assim, se um dia trocarmos
 * o armazenamento (por uma API, por exemplo), só este arquivo muda.
 */

// Prefixo "estoque:" evita conflito com outros sites/apps abertos no mesmo endereço.
const CHAVE_PRODUTOS = 'estoque:produtos';
const CHAVE_MOVIMENTACOES = 'estoque:movimentacoes';

/**
 * Lê uma lista salva no LocalStorage.
 * Se não existir nada, se o JSON estiver corrompido ou se o conteúdo não for
 * uma lista, devolve [] em vez de quebrar a aplicação inteira.
 * @param {string} chave
 * @returns {Array}
 */
function lerLista(chave) {
  try {
    const conteudo = localStorage.getItem(chave);
    if (conteudo === null) {
      return [];
    }
    const dados = JSON.parse(conteudo);
    if (!Array.isArray(dados)) {
      console.warn(`Dados em "${chave}" não são uma lista. Ignorando.`);
      return [];
    }
    return dados;
  } catch (erro) {
    console.error(`Não foi possível ler "${chave}" do LocalStorage.`, erro);
    return [];
  }
}

/**
 * Salva uma lista no LocalStorage como JSON.
 * Pode falhar se o armazenamento estiver cheio ou bloqueado pelo navegador.
 * @param {string} chave
 * @param {Array} lista
 * @returns {boolean} true se salvou, false se deu erro.
 */
function salvarLista(chave, lista) {
  try {
    localStorage.setItem(chave, JSON.stringify(lista));
    return true;
  } catch (erro) {
    console.error(`Não foi possível salvar "${chave}" no LocalStorage.`, erro);
    return false;
  }
}

/** @returns {Array<Object>} Todos os produtos salvos. */
function carregarProdutos() {
  return lerLista(CHAVE_PRODUTOS);
}

/**
 * @param {Array<Object>} produtos
 * @returns {boolean} true se salvou.
 */
function salvarProdutos(produtos) {
  return salvarLista(CHAVE_PRODUTOS, produtos);
}

/** @returns {Array<Object>} Todas as movimentações salvas. */
function carregarMovimentacoes() {
  return lerLista(CHAVE_MOVIMENTACOES);
}

/**
 * @param {Array<Object>} movimentacoes
 * @returns {boolean} true se salvou.
 */
function salvarMovimentacoes(movimentacoes) {
  return salvarLista(CHAVE_MOVIMENTACOES, movimentacoes);
}
