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
  // TODO (Fase 2): resumo e tabela.  (Fase 4): pesquisa, select e histórico.
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
  // TODO (Fase 2: cadastro / Fase 3: edição)
}

/** Botão "Cancelar" da edição: volta o formulário ao modo cadastro. */
function tratarCancelarEdicao() {
  // TODO (Fase 3)
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
  // TODO (Fase 3)
}

/**
 * Envio do formulário de movimentação: registrarMovimentacao, depois mensagem,
 * resetarFormularioMovimentacao e atualizarTela (ou mostrar os erros).
 * @param {SubmitEvent} evento
 */
function tratarEnvioFormularioMovimentacao(evento) {
  evento.preventDefault();
  // TODO (Fase 4)
}

/** Digitação no campo de pesquisa: filtra a tabela em tempo real. */
function tratarPesquisa() {
  // TODO (Fase 4): basta chamar atualizarTela, que já lê o termo pesquisado.
}

/** Botão "Carregar dados de exemplo": popula o estoque para prints e vídeo. */
function tratarCarregarDadosExemplo() {
  // TODO (Fase 5)
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
