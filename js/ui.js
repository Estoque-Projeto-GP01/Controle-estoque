'use strict';

/*
 * ui.js
 * Tudo que desenha ou lê a tela: tabelas, contadores, formulários e mensagens.
 * NÃO contém regra de negócio (isso é do produtos.js / movimentacao.js).
 *
 * SEGURANÇA: dados digitados pelo usuário são exibidos SOMENTE com
 * document.createElement + textContent. Nunca usar innerHTML com esses dados,
 * porque um nome como <img src=x onerror=...> seria executado como código (XSS).
 */

// Liga cada chave de erro (nome do campo no modelo) ao id do <p> de erro e do input no HTML.
const CAMPOS_FORM_PRODUTO = {
  nome: { idCampo: 'produto-nome', idErro: 'erro-produto-nome' },
  categoria: { idCampo: 'produto-categoria', idErro: 'erro-produto-categoria' },
  quantidade: { idCampo: 'produto-quantidade', idErro: 'erro-produto-quantidade' },
  estoqueMinimo: { idCampo: 'produto-estoque-minimo', idErro: 'erro-produto-estoque-minimo' }
};

const CAMPOS_FORM_MOVIMENTACAO = {
  produtoId: { idCampo: 'mov-produto', idErro: 'erro-mov-produto' },
  tipo: { idCampo: 'mov-tipo', idErro: 'erro-mov-tipo' },
  quantidade: { idCampo: 'mov-quantidade', idErro: 'erro-mov-quantidade' }
};

// Textos que mudam entre os modos "cadastro" e "edição" do formulário de produto.
const TEXTOS_FORM_PRODUTO = {
  CADASTRO: { titulo: 'Cadastrar produto', botao: 'Cadastrar produto' },
  EDICAO: { titulo: 'Editar produto', botao: 'Salvar alterações' }
};

const TEXTO_LISTA_VAZIA = 'Nenhum produto cadastrado ainda. Use o formulário acima para cadastrar o primeiro.';
const TEXTO_PESQUISA_SEM_RESULTADO = 'Nenhum produto encontrado.';

/* ---------- Mensagens ---------- */

/**
 * Mostra uma mensagem na área #mensagem (que tem aria-live, então o leitor de tela anuncia).
 * Trocar a classe para mensagem--sucesso ou mensagem--erro conforme o tipo.
 * @param {string} texto
 * @param {'sucesso'|'erro'} tipo
 */
function mostrarMensagem(texto, tipo) {
  // TODO (Fase 2)
}

/** Limpa o texto e as classes de tipo da área #mensagem. */
function limparMensagem() {
  // TODO (Fase 2)
}

/* ---------- Erros nos campos ---------- */

/**
 * Mostra os erros de validação junto aos campos.
 * Para cada chave de "erros": escrever o texto no <p> de erro, adicionar a classe
 * campo--invalido e aria-invalid="true" no input. Colocar o foco no primeiro campo com erro.
 * @param {Object<string, string>} erros Ex.: { nome: 'Informe o nome.' }
 * @param {Object} mapaCampos CAMPOS_FORM_PRODUTO ou CAMPOS_FORM_MOVIMENTACAO.
 */
function mostrarErrosCampos(erros, mapaCampos) {
  // TODO (Fase 2)
}

/**
 * Remove todas as mensagens de erro e marcações de inválido de um formulário.
 * @param {Object} mapaCampos CAMPOS_FORM_PRODUTO ou CAMPOS_FORM_MOVIMENTACAO.
 */
function limparErrosCampos(mapaCampos) {
  // TODO (Fase 2)
}

/* ---------- Resumo e listagem ---------- */

/**
 * Atualiza os três contadores do topo.
 * @param {{total: number, estoqueBaixo: number, semEstoque: number}} resumo
 */
function renderizarResumo(resumo) {
  // TODO (Fase 2)
}

/**
 * Redesenha o <tbody id="corpo-tabela-produtos">.
 * Se a lista estiver vazia: esconder a tabela e mostrar #lista-vazia com
 * TEXTO_LISTA_VAZIA (sem pesquisa) ou TEXTO_PESQUISA_SEM_RESULTADO (com pesquisa).
 * @param {Array<Object>} produtos Lista já filtrada e ordenada.
 * @param {boolean} haPesquisaAtiva true se o campo de pesquisa tem texto.
 */
function renderizarTabelaProdutos(produtos, haPesquisaAtiva) {
  // TODO (Fase 2)
}

/**
 * Cria a linha <tr> de um produto: nome, categoria, quantidade, estoque mínimo,
 * badge de status e botões "Editar" e "Excluir".
 * Os botões levam data-acao="editar"/"excluir" e data-id="<id do produto>",
 * para o app.js tratar todos os cliques com um único listener na tabela.
 * Adicionar à <tr> a classe linha--estoque-baixo ou linha--sem-estoque conforme o status.
 * @param {Object} produto
 * @returns {HTMLTableRowElement}
 */
function criarLinhaProduto(produto) {
  // TODO (Fase 2)
  return document.createElement('tr');
}

/**
 * Cria um <span class="badge ..."> com o texto do status.
 * Classes: badge--normal, badge--estoque-baixo, badge--sem-estoque.
 * @param {string} status Um dos valores de STATUS_ESTOQUE.
 * @returns {HTMLSpanElement}
 */
function criarBadgeStatus(status) {
  // TODO (Fase 2)
  return document.createElement('span');
}

/* ---------- Formulário de produto ---------- */

/**
 * Lê os valores do formulário de produto (sem converter, a validação faz isso).
 * @returns {{id: string, nome: string, categoria: string, quantidade: string, estoqueMinimo: string}}
 */
function lerFormularioProduto() {
  // TODO (Fase 2)
  return { id: '', nome: '', categoria: '', quantidade: '', estoqueMinimo: '' };
}

/**
 * Coloca o formulário em modo edição: preenche os campos, guarda o id no
 * campo oculto, desabilita a quantidade (e mostra #dica-produto-quantidade),
 * troca título e botão para TEXTOS_FORM_PRODUTO.EDICAO, mostra "Cancelar"
 * e leva o foco para o campo nome.
 * @param {Object} produto
 */
function preencherFormularioEdicao(produto) {
  limparErrosCampos(CAMPOS_FORM_PRODUTO);

  document.getElementById('produto-id').value = produto.id;
  document.getElementById('produto-nome').value = produto.nome;
  document.getElementById('produto-categoria').value = produto.categoria;
  document.getElementById('produto-estoque-minimo').value = produto.estoqueMinimo;

  // A quantidade só muda por movimentação: fica travada e com a dica visível.
  const campoQuantidade = document.getElementById('produto-quantidade');
  campoQuantidade.value = produto.quantidade;
  campoQuantidade.disabled = true;
  document.getElementById('dica-produto-quantidade').hidden = false;

  document.getElementById('titulo-form-produto').textContent = TEXTOS_FORM_PRODUTO.EDICAO.titulo;
  document.getElementById('btn-salvar-produto').textContent = TEXTOS_FORM_PRODUTO.EDICAO.botao;
  document.getElementById('btn-cancelar-edicao').hidden = false;

  document.getElementById('produto-nome').focus();
}

/**
 * Volta o formulário ao modo cadastro: limpa campos e erros, reabilita a
 * quantidade, esconde "Cancelar" e restaura TEXTOS_FORM_PRODUTO.CADASTRO.
 */
function resetarFormularioProduto() {
  // Parte do cadastro (Emerson): limpar campos e erros.
  document.getElementById('form-produto').reset();
  limparErrosCampos(CAMPOS_FORM_PRODUTO);

  // Parte da edição (Karla): desfazer o modo edição.
  document.getElementById('produto-id').value = '';
  document.getElementById('produto-quantidade').disabled = false;
  document.getElementById('dica-produto-quantidade').hidden = true;
  document.getElementById('titulo-form-produto').textContent = TEXTOS_FORM_PRODUTO.CADASTRO.titulo;
  document.getElementById('btn-salvar-produto').textContent = TEXTOS_FORM_PRODUTO.CADASTRO.botao;
  document.getElementById('btn-cancelar-edicao').hidden = true;
}

/* ---------- Movimentação e histórico ---------- */

/**
 * Preenche o <select id="mov-produto"> com os produtos (texto: nome e quantidade atual).
 * Manter a primeira opção "Selecione um produto" e, se possível, a seleção atual.
 * @param {Array<Object>} produtos
 */
function renderizarSelectProdutos(produtos) {
  const selectProduto = document.getElementById('mov-produto');
  if (!selectProduto) {
    return;
  }

  const valorSelecionadoAntes = selectProduto.value;

  selectProduto.textContent = '';

  const opcaoPadrao = document.createElement('option');
  opcaoPadrao.value = '';
  opcaoPadrao.textContent = 'Selecione um produto';
  selectProduto.appendChild(opcaoPadrao);

  produtos.forEach((produto) => {
    const opcao = document.createElement('option');
    opcao.value = produto.id;
    opcao.textContent = `${produto.nome} (${produto.quantidade} em estoque)`;
    selectProduto.appendChild(opcao);
  });

  const existeNaLista = produtos.some((produto) => produto.id === valorSelecionadoAntes);
  selectProduto.value = existeNaLista ? valorSelecionadoAntes : '';
}

/**
 * Lê os valores do formulário de movimentação.
 * @returns {{produtoId: string, tipo: string, quantidade: string, observacao: string}}
 */
function lerFormularioMovimentacao() {
  return {
    produtoId: document.getElementById('mov-produto').value,
    tipo: document.getElementById('mov-tipo').value,
    quantidade: document.getElementById('mov-quantidade').value,
    observacao: document.getElementById('mov-observacao').value
  };
}

/** Limpa quantidade e observação após registrar (mantém produto e tipo para agilizar). */
function resetarFormularioMovimentacao() {
  document.getElementById('mov-quantidade').value = '';
  document.getElementById('mov-observacao').value = '';
  limparErrosCampos(CAMPOS_FORM_MOVIMENTACAO);
}

/**
 * Redesenha o <tbody id="corpo-tabela-movimentacoes">, ou mostra #historico-vazio.
 * Colunas: data (formatarDataHora), produto, tipo (badge--entrada/badge--saida),
 * quantidade e observação.
 * @param {Array<Object>} movimentacoes Já ordenadas da mais recente para a mais antiga.
 * @param {function(string): string} obterNomeProduto Recebe o produtoId e devolve o nome.
 */
function renderizarHistorico(movimentacoes, obterNomeProduto) {
  // TODO (Fase 4)
}
