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

// Aparência de cada status. Fica aqui porque classe CSS é assunto da tela, não da regra de negócio.
const ESTILOS_STATUS = {
  [STATUS_ESTOQUE.NORMAL]: { badge: 'badge--normal', linha: '' },
  [STATUS_ESTOQUE.BAIXO]: { badge: 'badge--estoque-baixo', linha: 'linha--estoque-baixo' },
  [STATUS_ESTOQUE.SEM_ESTOQUE]: { badge: 'badge--sem-estoque', linha: 'linha--sem-estoque' }
};

/* ---------- Mensagens ---------- */

/**
 * Mostra uma mensagem na área #mensagem (que tem aria-live, então o leitor de tela anuncia).
 * Trocar a classe para mensagem--sucesso ou mensagem--erro conforme o tipo.
 * @param {string} texto
 * @param {'sucesso'|'erro'} tipo
 */
function mostrarMensagem(texto, tipo) {
  const area = document.getElementById('mensagem');
  area.className = `mensagem mensagem--${tipo}`;
  area.textContent = texto;
}

/** Limpa o texto e as classes de tipo da área #mensagem. */
function limparMensagem() {
  const area = document.getElementById('mensagem');
  area.className = 'mensagem';
  area.textContent = '';
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
  document.getElementById('total-produtos').textContent = resumo.total;
  document.getElementById('total-estoque-baixo').textContent = resumo.estoqueBaixo;
  document.getElementById('total-sem-estoque').textContent = resumo.semEstoque;
}

/**
 * Redesenha o <tbody id="corpo-tabela-produtos">.
 * Se a lista estiver vazia: esconder a tabela e mostrar #lista-vazia com
 * TEXTO_LISTA_VAZIA (sem pesquisa) ou TEXTO_PESQUISA_SEM_RESULTADO (com pesquisa).
 * @param {Array<Object>} produtos Lista já filtrada e ordenada.
 * @param {boolean} haPesquisaAtiva true se o campo de pesquisa tem texto.
 */
function renderizarTabelaProdutos(produtos, haPesquisaAtiva) {
  const listaEstaVazia = produtos.length === 0;
  const avisoVazio = document.getElementById('lista-vazia');

  document.getElementById('corpo-tabela-produtos').replaceChildren(...produtos.map(criarLinhaProduto));

  // Esconde a caixa de rolagem inteira, senão o Tab pararia numa região vazia.
  document.getElementById('tabela-produtos').parentElement.hidden = listaEstaVazia;
  avisoVazio.hidden = !listaEstaVazia;
  avisoVazio.textContent = haPesquisaAtiva ? TEXTO_PESQUISA_SEM_RESULTADO : TEXTO_LISTA_VAZIA;
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
  const status = calcularStatusEstoque(produto);
  const linha = document.createElement('tr');
  linha.className = ESTILOS_STATUS[status].linha;

  linha.append(
    criarCelula(produto.nome, 'tabela__nome'),
    criarCelula(produto.categoria),
    criarCelula(produto.quantidade, 'tabela__numero'),
    criarCelula(produto.estoqueMinimo, 'tabela__numero'),
    criarCelula(criarBadgeStatus(status)),
    criarCelula(criarAcoesProduto(produto))
  );
  return linha;
}

/**
 * Cria uma célula <td>. O append() trata texto como texto puro, nunca como HTML.
 * @param {string|number|Node} conteudo
 * @param {string} [classe]
 * @returns {HTMLTableCellElement}
 */
function criarCelula(conteudo, classe = '') {
  const celula = document.createElement('td');
  celula.className = classe;
  celula.append(conteudo);
  return celula;
}

/**
 * Agrupa os botões numa <div>, porque display:flex direto no <td> desalinha a tabela.
 * @param {Object} produto
 * @returns {HTMLDivElement}
 */
function criarAcoesProduto(produto) {
  const acoes = document.createElement('div');
  acoes.className = 'tabela__acoes';
  acoes.append(
    criarBotaoAcao(produto, 'editar', 'Editar', 'btn--secundario'),
    criarBotaoAcao(produto, 'excluir', 'Excluir', 'btn--perigo')
  );
  return acoes;
}

/**
 * Cria um botão de ação de uma linha da tabela.
 * @param {Object} produto
 * @param {'editar'|'excluir'} acao
 * @param {string} rotulo
 * @param {string} classe
 * @returns {HTMLButtonElement}
 */
function criarBotaoAcao(produto, acao, rotulo, classe) {
  const botao = document.createElement('button');
  botao.type = 'button';
  botao.className = `btn btn--pequeno ${classe}`;
  botao.dataset.acao = acao;
  botao.dataset.id = produto.id;
  botao.textContent = rotulo;
  // Sem o nome, o leitor de tela anunciaria vários botões "Editar" iguais.
  botao.setAttribute('aria-label', `${rotulo} ${produto.nome}`);
  return botao;
}

/**
 * Cria um <span class="badge ..."> com o texto do status.
 * Classes: badge--normal, badge--estoque-baixo, badge--sem-estoque.
 * @param {string} status Um dos valores de STATUS_ESTOQUE.
 * @returns {HTMLSpanElement}
 */
function criarBadgeStatus(status) {
  const badge = document.createElement('span');
  badge.className = `badge ${ESTILOS_STATUS[status].badge}`;
  badge.textContent = status;
  return badge;
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
  const corpoTabela = document.getElementById('corpo-tabela-movimentacoes');
  const mensagemVazio = document.getElementById('historico-vazio');
  if (!corpoTabela) {
    return;
  }

  const tabela = corpoTabela.closest('table');
  corpoTabela.textContent = '';

  const estaVazio = movimentacoes.length === 0;
  if (tabela) {
    tabela.hidden = estaVazio;
  }
  if (mensagemVazio) {
    mensagemVazio.hidden = !estaVazio;
  }
  if (estaVazio) {
    return;
  }

  movimentacoes.forEach((movimentacao) => {
    const linha = document.createElement('tr');

    const colunaData = document.createElement('td');
    colunaData.textContent = formatarDataHora(movimentacao.data);

    const colunaProduto = document.createElement('td');
    colunaProduto.textContent = obterNomeProduto(movimentacao.produtoId);

    const colunaTipo = document.createElement('td');
    const badge = document.createElement('span');
    badge.className = `badge badge--${movimentacao.tipo}`;
    badge.textContent = movimentacao.tipo === TIPOS_MOVIMENTACAO.ENTRADA ? 'Entrada' : 'Saída';
    colunaTipo.appendChild(badge);

    const colunaQuantidade = document.createElement('td');
    colunaQuantidade.textContent = String(movimentacao.quantidade);

    const colunaObservacao = document.createElement('td');
    colunaObservacao.textContent = movimentacao.observacao || '-';

    linha.append(colunaData, colunaProduto, colunaTipo, colunaQuantidade, colunaObservacao);
    corpoTabela.appendChild(linha);
  });
}
