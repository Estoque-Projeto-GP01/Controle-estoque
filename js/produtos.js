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
function validarProduto(dados, opcoes = {}) {
  // TODO (Fase 2): implementar as regras acima.
  return { valido: false, erros: {} };
}

/**
 * Verifica se já existe produto com o mesmo nome, ignorando maiúsculas,
 * minúsculas e acentos (usar normalizarTexto nos dois lados da comparação).
 * @param {string} nome
 * @param {string} [idIgnorado] id do produto que deve ser desconsiderado (edição).
 * @returns {boolean}
 */
function existeNomeDuplicado(nome, idIgnorado) {
  // TODO (Fase 2)
  return false;
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
  // TODO (Fase 2)
  return { sucesso: false, erros: {}, produto: null };
}

/**
 * Lista todos os produtos ordenados por nome (A-Z), ignorando acentos e
 * maiúsculas. Dica: a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' }).
 * @returns {Array<Object>}
 */
function listarProdutos() {
  return carregarProdutos().sort((a, b) =>
    a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' })
  );
}

/**
 * Procura um produto pelo id.
 * @param {string} id
 * @returns {Object|null} O produto ou null se não existir.
 */
function buscarProdutoPorId(id) {
  const produtos = carregarProdutos();
  const produto = produtos.find((item) => item.id === id);
  return produto || null;
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
  const produtos = carregarProdutos();
  const indice = produtos.findIndex((produto) => produto.id === id);

  if (indice === -1) {
    return { sucesso: false, erros: { nome: 'Produto não encontrado.' }, produto: null };
  }

  const validacao = validarProduto(dados, { idIgnorado: id, validarQuantidade: false });
  if (!validacao.valido) {
    return { sucesso: false, erros: validacao.erros, produto: null };
  }

  const produtoAtualizado = {
    ...produtos[indice],
    nome: String(dados.nome).trim(),
    categoria: String(dados.categoria).trim(),
    estoqueMinimo: converterParaInteiro(dados.estoqueMinimo),
    atualizadoEm: obterDataAtualIso()
  };
  produtos[indice] = produtoAtualizado;

  if (!salvarProdutos(produtos)) {
    return {
      sucesso: false,
      erros: { nome: 'Não foi possível salvar o produto no navegador.' },
      produto: null
    };
  }

  return { sucesso: true, erros: {}, produto: produtoAtualizado };
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
  const produtos = carregarProdutos();
  const restantes = produtos.filter((produto) => produto.id !== id);

  // Nada foi removido: o id não existe.
  if (restantes.length === produtos.length) {
    return false;
  }

  if (!salvarProdutos(restantes)) {
    return false;
  }

  excluirMovimentacoesDoProduto(id);
  return true;
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
  const busca = normalizarTexto(termo);

  if (!busca) {
    return produtos;
  }

  return produtos.filter((produto) =>
    normalizarTexto(produto.nome).includes(busca)
  );
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
