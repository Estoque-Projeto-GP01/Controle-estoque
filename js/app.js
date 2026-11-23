'use strict';

/*
 * app.js
 * Ponto de entrada: liga os eventos da tela às regras de negócio e manda a
 * interface se redesenhar. É o "maestro": não valida nada e não desenha nada
 * sozinho, só chama produtos.js / movimentacao.js e depois ui.js.
 * Como os scripts usam "defer", o HTML já foi lido quando este arquivo roda.
 */

/**
 * Redesenha tudo que depende dos dados: resumo, tabela (respeitando a pesquisa),
 * select de produtos da movimentação e histórico.
 * Chamar depois de qualquer alteração (cadastro, edição, exclusão, movimentação).
 */
function atualizarTela() {
  const produtos = listarProdutos();

  const termoPesquisa = document.getElementById('campo-pesquisa').value;
  const haPesquisaAtiva = normalizarTexto(termoPesquisa) !== '';
  const produtosFiltrados = filtrarProdutosPorNome(produtos, termoPesquisa);

  renderizarResumo(calcularResumo(produtos)); // sempre do estoque inteiro, mesmo com pesquisa
renderizarTabelaProdutos(produtosFiltrados, haPesquisaAtiva);
  
  renderizarSelectProdutos(produtos);

  const obterNomeProduto = (produtoId) => {
    const produto = produtos.find((item) => item.id === produtoId);
    return produto ? produto.nome : 'Produto removido';
  };
  renderizarHistorico(listarMovimentacoesRecentes(), obterNomeProduto);
} 
  
/**
 * Envio do formulário de produto.
 * Se o campo oculto produto-id estiver vazio, é cadastro (criarProduto);
 * se tiver um id, é edição (atualizarProduto).
 * Sucesso: mensagem, resetarFormularioProduto, atualizarTela.
 * Erro: mostrarErrosCampos(resultado.erros, CAMPOS_FORM_PRODUTO) e mensagem de erro.
 * @param {SubmitEvent} evento
 */
function tratarEnvioFormularioProduto(evento) {
  evento.preventDefault(); // impede o recarregamento da página
  limparMensagem();
  limparErrosCampos(CAMPOS_FORM_PRODUTO);

  const dados = lerFormularioProduto();
  const estaEditando = dados.id !== '';

  const resultado = estaEditando
    ? atualizarProduto(dados.id, dados)
    : criarProduto(dados);

  if (!resultado.sucesso) {
    mostrarErrosCampos(resultado.erros, CAMPOS_FORM_PRODUTO);
    mostrarMensagem('Verifique os campos destacados antes de salvar o produto.', 'erro');
    return;
  }

  mostrarMensagem(
    estaEditando ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!',
    'sucesso'
  );
  resetarFormularioProduto();
  atualizarTela();
}

/** Botão "Cancelar" da edição: volta o formulário ao modo cadastro. */
function tratarCancelarEdicao() {
  resetarFormularioProduto();
  limparMensagem();
}

/**
 * Cliques na tabela de produtos (delegação de eventos): um único listener no
 * <tbody> atende os botões de todas as linhas, inclusive as criadas depois.
 * Ler evento.target.closest('button[data-acao]') e, conforme data-acao:
 *  - "editar":  preencherFormularioEdicao(buscarProdutoPorId(id))
 *  - "excluir": confirm('Excluir "<nome>"? As movimentações dele também serão apagadas.')
 *               e, se confirmado, excluirProduto(id), mensagem e atualizarTela.
 * @param {MouseEvent} evento
 */
function tratarCliqueTabelaProdutos(evento) {
  const botao = evento.target.closest('button[data-acao]');
  if (!botao) {
    return;
  }

  const id = botao.dataset.id;
  const acao = botao.dataset.acao;
  const produto = buscarProdutoPorId(id);

  if (!produto) {
    mostrarMensagem('Produto não encontrado.', 'erro');
    atualizarTela();
    return;
  }

  if (acao === 'editar') {
    limparMensagem();
    preencherFormularioEdicao(produto);
    return;
  }

  if (acao === 'excluir') {
    const confirmou = window.confirm(
      `Excluir "${produto.nome}"? As movimentações dele também serão apagadas.`
    );
    if (!confirmou) {
      return;
    }

    if (!excluirProduto(id)) {
      mostrarMensagem('Não foi possível excluir o produto.', 'erro');
      return;
    }

    // Se o produto excluído estava aberto para edição, volta ao modo cadastro.
    if (document.getElementById('produto-id').value === id) {
      resetarFormularioProduto();
    }

    mostrarMensagem('Produto excluído com sucesso!', 'sucesso');
    atualizarTela();
  }
}

/**
 * Envio do formulário de movimentação: registrarMovimentacao, depois mensagem,
 * resetarFormularioMovimentacao e atualizarTela (ou mostrar os erros).
 * @param {SubmitEvent} evento
 */
function tratarEnvioFormularioMovimentacao(evento) {
  evento.preventDefault();

  limparMensagem();
  limparErrosCampos(CAMPOS_FORM_MOVIMENTACAO);

  const dados = lerFormularioMovimentacao();
  const resultado = registrarMovimentacao(dados);

  if (!resultado.sucesso) {
    mostrarErrosCampos(resultado.erros, CAMPOS_FORM_MOVIMENTACAO);
    mostrarMensagem('Verifique os campos destacados antes de registrar a movimentação.', 'erro');
    return;
  }

  const textoTipo = resultado.movimentacao.tipo === TIPOS_MOVIMENTACAO.ENTRADA ? 'Entrada' : 'Saída';
  mostrarMensagem(`${textoTipo} registrada com sucesso!`, 'sucesso');
  resetarFormularioMovimentacao();
  atualizarTela();
}

/** Digitação no campo de pesquisa: filtra a tabela em tempo real. */
function tratarPesquisa() {
  atualizarTela();
}

// Nome, categoria, quantidade e estoque mínimo. Inclui itens com estoque baixo e um zerado,
// para os prints e o vídeo mostrarem todos os status.
const PRODUTOS_EXEMPLO = [
  ['Arroz 5kg', 'Alimentos', 20, 5],
  ['Feijão 1kg', 'Alimentos', 3, 5],
  ['Detergente', 'Limpeza', 0, 10],
  ['Refrigerante 2L', 'Bebidas', 15, 5],
  ['Papel Higiênico', 'Higiene', 5, 5],
  ['Caneta azul', 'Papelaria', 2, 10],
  ['Sabonete', 'Higiene', 30, 10],
  ['Água mineral 500ml', 'Bebidas', 48, 12],
  ['Caderno 96 folhas', 'Papelaria', 7, 5]
];

// Posição do produto em PRODUTOS_EXEMPLO, tipo, quantidade, observação e há quantas horas aconteceu.
// Horários diferentes deixam a ordem do histórico previsível.
const MOVIMENTACOES_EXEMPLO = [
  [0, 'entrada', 10, 'Entrada de mercadoria', 5],
  [1, 'saida', 2, 'Venda no balcão', 4],
  [3, 'entrada', 5, 'Reposição de estoque', 3],
  [5, 'saida', 8, 'Material para o escritório', 2],
  [2, 'saida', 4, 'Venda no balcão', 1]
];

/** Botão "Carregar dados de exemplo": popula o estoque para prints e vídeo. */
function tratarCarregarDadosExemplo() {
  // Sem confirm(): o enunciado só permite na exclusão. Por isso só carrega com o
  // estoque vazio, assim nunca apaga dados de verdade.
  if (carregarProdutos().length > 0) {
    mostrarMensagem('Os dados de exemplo só podem ser carregados com o estoque vazio.', 'erro');
    return;
  }

  const agora = Date.now();
  const dataHorasAtras = (horas) => new Date(agora - horas * 60 * 60 * 1000).toISOString();

  const produtos = PRODUTOS_EXEMPLO.map(([nome, categoria, quantidade, estoqueMinimo]) => ({
    id: gerarId(),
    nome,
    categoria,
    quantidade,
    estoqueMinimo,
    criadoEm: dataHorasAtras(24),
    atualizadoEm: dataHorasAtras(24)
  }));

  const movimentacoes = MOVIMENTACOES_EXEMPLO.map(([indice, tipo, quantidade, observacao, horas]) => ({
    id: gerarId(),
    produtoId: produtos[indice].id,
    tipo,
    quantidade,
    observacao,
    data: dataHorasAtras(horas)
  }));

  if (!salvarProdutos(produtos) || !salvarMovimentacoes(movimentacoes)) {
    mostrarMensagem('Não foi possível salvar os dados de exemplo.', 'erro');
    return;
  }

  atualizarTela();
  mostrarMensagem('Dados de exemplo carregados com sucesso!', 'sucesso');
}

/** Liga cada elemento ao seu tratador. Nada de onclick no HTML. */
function registrarEventos() {
  document.getElementById('form-produto').addEventListener('submit', tratarEnvioFormularioProduto);
  document.getElementById('btn-cancelar-edicao').addEventListener('click', tratarCancelarEdicao);
  document.getElementById('corpo-tabela-produtos').addEventListener('click', tratarCliqueTabelaProdutos);
  document.getElementById('form-movimentacao').addEventListener('submit', tratarEnvioFormularioMovimentacao);
  document.getElementById('campo-pesquisa').addEventListener('input', tratarPesquisa);
  document.getElementById('btn-dados-exemplo').addEventListener('click', tratarCarregarDadosExemplo);
}

function iniciarAplicacao() {
  registrarEventos();
  atualizarTela();
}

iniciarAplicacao();
