'use strict';

/*
 * produtos.js
 * Regras de negócio dos produtos: validar, criar, listar, atualizar e excluir.
 * NÃO mexe na tela (isso é do ui.js) e NÃO usa localStorage direto (usa storage.js).
 *
 * PADRÃO DE RETORNO das funções que alteram dados:
 *   { sucesso: true,  erros: {},               produto: {...} }
 *   { sucesso: false, erros: { nome: 'msg' },  produto: null  }
 * As chaves de "erros" são os nomes dos campos do modelo
 * (nome, categoria, quantidade, estoqueMinimo). O ui.js usa essas chaves
 * para mostrar cada mensagem junto ao campo certo.
 */

const CATEGORIAS = ['Alimentos', 'Bebidas', 'Limpeza', 'Higiene', 'Papelaria', 'Outros'];
const TAMANHO_MINIMO_NOME = 2;

// Textos exibidos na coluna "Status" da tabela.
const STATUS_ESTOQUE = {
  NORMAL: 'Normal',
  BAIXO: 'Estoque baixo',
  SEM_ESTOQUE: 'Sem estoque'
};

/**
 * Valida os dados vindos do formulário de produto.
 * Regras:
 *  - nome: obrigatório, sem espaços nas pontas (usar trim), mínimo TAMANHO_MINIMO_NOME caracteres;
 *  - nome não pode repetir outro produto (usar existeNomeDuplicado);
 *  - categoria: precisa estar em CATEGORIAS;
 *  - quantidade: inteiro >= 0 (usar converterParaInteiro). Só valida se validarQuantidade for true,
 *    porque na edição a quantidade não é alterada;
 *  - estoqueMinimo: inteiro >= 0.
 * @param {{nome: string, categoria: string, quantidade: string, estoqueMinimo: string}} dados
 * @param {{idIgnorado?: string, validarQuantidade?: boolean}} [opcoes]
 *        idIgnorado: na edição, o id do próprio produto (para não acusar duplicidade com ele mesmo).
 *        validarQuantidade: padrão true; a edição passa false.
 * @returns {{valido: boolean, erros: Object<string, string>}}
 */
function validarProduto(dados, idIgnorado = null) {
  const erros = {};
  const nome = String(dados.nome || '').trim();

  if (nome === '') {
    erros.nome = 'Informe o nome.';
  } else if (nome.length < 2) {
    erros.nome = 'O nome deve ter pelo menos 2 caracteres.';
  } else if (nome.length > 60) {
    erros.nome = 'O nome deve ter no máximo 60 caracteres.';
  } else if (existeNomeDuplicado(nome, idIgnorado)) {
    erros.nome = 'Já existe um produto com esse nome.';
  }

  if (!CATEGORIAS_PRODUTO.includes(dados.categoria)) {
    erros.categoria = 'Escolha uma categoria.';
  }

  const textoQuantidade = String(dados.quantidade ?? '').trim();
  const quantidade = converterInteiro(textoQuantidade);
  if (textoQuantidade === '') {
    erros.quantidade = 'Informe a quantidade.';
  } else if (!Number.isInteger(quantidade) || quantidade < 0) {
    erros.quantidade = 'A quantidade deve ser um número inteiro maior ou igual a 0.';
  }

  const textoMinimo = String(dados.estoqueMinimo ?? '').trim();
  const estoqueMinimo = converterInteiro(textoMinimo);
  if (textoMinimo === '') {
    erros.estoqueMinimo = 'Informe o estoque mínimo.';
  } else if (!Number.isInteger(estoqueMinimo) || estoqueMinimo < 0) {
    erros.estoqueMinimo = 'O estoque mínimo deve ser um número inteiro maior ou igual a 0.';
  }

  return erros;
}

/**
 * Verifica se já existe produto com o mesmo nome, ignorando maiúsculas,
 * minúsculas e acentos (usar normalizarTexto nos dois lados da comparação).
 * @param {string} nome
 * @param {string} [idIgnorado] id do produto que deve ser desconsiderado (edição).
 * @returns {boolean}
 */
function existeNomeDuplicado(nome, idIgnorado = null) {
  const alvo = normalizarTexto(nome.trim());
  return listarProdutos().some(
    (produto) => produto.id !== idIgnorado && normalizarTexto(produto.nome) === alvo
  );
}

/**
 * Cria um produto novo e salva.
 * Passos: validar -> montar objeto do modelo (id com gerarId, nome com trim,
 * números convertidos, criadoEm e atualizadoEm com obterDataAtualIso)
 * -> adicionar à lista -> salvarProdutos.
 * @param {Object} dados Dados do formulário.
 * @returns {{sucesso: boolean, erros: Object, produto: Object|null}}
 */
function criarProduto(dados) {
  const erros = validarProduto(dados);
  if (Object.keys(erros).length > 0) {
    return { sucesso: false, erros: erros, produto: null };
  }

  const agora = new Date().toISOString();
  const produto = {
    id: gerarId(),
    nome: dados.nome.trim(),
    categoria: dados.categoria,
    quantidade: converterInteiro(dados.quantidade),
    estoqueMinimo: converterInteiro(dados.estoqueMinimo),
    criadoEm: agora,
    atualizadoEm: agora,
  };

  const lista = listarProdutos();
  lista.push(produto);
  salvarProdutos(lista);

  return { sucesso: true, erros: {}, produto: produto };
}

/**
 * Procura um produto pelo id.
 * @param {string} id
 * @returns {Object|null} O produto ou null se não existir.
 */
function buscarProdutoPorId(id) {
  // TODO (Fase 3)
  return null;
}

/**
 * Atualiza nome, categoria e estoque mínimo de um produto existente.
 * A quantidade NÃO é alterada aqui (só por movimentação, para manter o histórico confiável).
 * Validar com validarProduto(dados, { idIgnorado: id, validarQuantidade: false })
 * e atualizar atualizadoEm.
 * @param {string} id
 * @param {Object} dados
 * @returns {{sucesso: boolean, erros: Object, produto: Object|null}}
 */
function atualizarProduto(id, dados) {
  // TODO (Fase 3)
  return { sucesso: false, erros: {}, produto: null };
}

/**
 * Altera somente a quantidade de um produto e o atualizadoEm.
 * Usada APENAS pelo movimentacao.js, depois que a movimentação já foi validada.
 * @param {string} id
 * @param {number} novaQuantidade Inteiro >= 0.
 * @returns {boolean} true se salvou.
 */
function atualizarQuantidadeProduto(id, novaQuantidade) {
  if (!Number.isInteger(novaQuantidade) || novaQuantidade < 0) {
    return false;
  }

  const produtos = carregarProdutos();
  const indice = produtos.findIndex((produto) => produto.id === id);

  if (indice === -1) {
    return false;
  }

  produtos[indice].quantidade = novaQuantidade;
  produtos[indice].atualizadoEm = obterDataAtualIso();

  return salvarProdutos(produtos);
}

/**
 * Exclui o produto e também todas as movimentações dele
 * (chamar excluirMovimentacoesDoProduto, do movimentacao.js).
 * A confirmação com o usuário é feita antes, no app.js.
 * @param {string} id
 * @returns {boolean} true se excluiu.
 */
function excluirProduto(id) {
  // TODO (Fase 3)
  return false;
}

/**
 * Calcula o status do estoque:
 *  - quantidade === 0                    -> STATUS_ESTOQUE.SEM_ESTOQUE
 *  - quantidade <= estoqueMinimo (e > 0) -> STATUS_ESTOQUE.BAIXO
 *  - demais casos                        -> STATUS_ESTOQUE.NORMAL
 * @param {Object} produto
 * @returns {string} Um dos valores de STATUS_ESTOQUE.
 */
function calcularStatusEstoque(produto) {
  // O zero vem primeiro porque também satisfaz "quantidade <= estoqueMinimo".
  if (produto.quantidade === 0) {
    return STATUS_ESTOQUE.SEM_ESTOQUE;
  }
  if (produto.quantidade <= produto.estoqueMinimo) {
    return STATUS_ESTOQUE.BAIXO;
  }
  return STATUS_ESTOQUE.NORMAL;
}

/**
 * Filtra produtos cujo nome contém o termo, ignorando maiúsculas e acentos.
 * Termo vazio devolve a lista inteira.
 * @param {Array<Object>} produtos
 * @param {string} termo
 * @returns {Array<Object>}
 */
function filtrarProdutosPorNome(produtos, termo) {
  // TODO (Fase 4)
  return produtos;
}

/**
 * Conta os números exibidos nos cartões de resumo.
 * @param {Array<Object>} produtos
 * @returns {{total: number, estoqueBaixo: number, semEstoque: number}}
 */
function calcularResumo(produtos) {
  // Reaproveita a regra de status para o contador nunca divergir da tabela.
  const status = produtos.map(calcularStatusEstoque);

  return {
    total: produtos.length,
    estoqueBaixo: status.filter((item) => item === STATUS_ESTOQUE.BAIXO).length,
    semEstoque: status.filter((item) => item === STATUS_ESTOQUE.SEM_ESTOQUE).length
  };
}
