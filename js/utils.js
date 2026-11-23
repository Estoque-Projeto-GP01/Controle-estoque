'use strict';

/*
 * utils.js
 * Funções auxiliares genéricas, sem regra de negócio e sem acesso à tela.
 * Qualquer outro arquivo pode usá-las (por isso este é o primeiro script carregado).
 */

/**
 * Gera um identificador único para produtos e movimentações.
 * crypto.randomUUID() só existe em navegadores recentes e em contexto seguro
 * (https ou localhost), então ao abrir via file:// pode não estar disponível:
 * nesse caso usamos data atual + número aleatório.
 * @returns {string}
 */
function gerarId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  const parteAleatoria = Math.random().toString(36).slice(2, 10);
  return `${Date.now().toString(36)}-${parteAleatoria}`;
}

/**
 * Retorna a data e hora atuais no formato ISO 8601 (o formato salvo no LocalStorage).
 * @returns {string} Ex.: "2026-11-17T14:30:00.000Z"
 */
function obterDataAtualIso() {
  return new Date().toISOString();
}

/**
 * Formata uma data ISO para exibição no padrão brasileiro.
 * @param {string} dataIso
 * @returns {string} Ex.: "17/11/2026 11:30". Se a data for inválida, retorna "-".
 */
function formatarDataHora(dataIso) {
  const data = new Date(dataIso);
  if (Number.isNaN(data.getTime())) {
    return '-';
  }
  return data.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

/**
 * Prepara um texto para comparação: remove acentos, ignora maiúsculas/minúsculas,
 * tira espaços das pontas e troca espaços repetidos por um só.
 * Usado na pesquisa ("acucar" encontra "Açúcar") e na checagem de nome duplicado.
 * @param {string} texto
 * @returns {string}
 */
function normalizarTexto(texto) {
  return String(texto ?? '')
    .normalize('NFD')                 // separa a letra do acento: "ç" vira "c" + "¸"
    .replace(/[̀-ͯ]/g, '')  // remove os acentos que ficaram separados
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * Converte o valor de um campo para número inteiro.
 * Não usamos Number() direto porque Number('') vale 0, e campo vazio
 * precisa ser tratado como "não preenchido", não como zero.
 * @param {string|number} valor
 * @returns {number} O inteiro (pode ser negativo) ou NaN se não for um inteiro válido.
 */
function converterParaInteiro(valor) {
  const texto = String(valor ?? '').trim();
  if (!/^-?\d+$/.test(texto)) {
    return NaN;
  }
  const numero = Number(texto);
  // Acima de 9 quatrilhões o JS arredonda (9007199254740993 vira ...992): tratamos como inválido.
  return Number.isSafeInteger(numero) ? numero : NaN;
}
