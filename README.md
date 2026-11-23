# Controle de Estoque

Aplicação web para controle de estoque de pequenos comércios e empresas, desenvolvida como **Projeto Integrador do 3º semestre de Análise e Desenvolvimento de Sistemas** (2ª etapa: implementação).

**Acesse a aplicação:** https://estoque-projeto-gp01.github.io/Controle-estoque/

## Problema e objetivo

Muitos pequenos comércios controlam o estoque com anotações manuais e planilhas. Isso gera divergência nas quantidades e lentidão nas consultas.

A aplicação controla o ciclo de vida dos produtos (cadastro, consulta, edição e baixa), acompanha as quantidades disponíveis e destaca os produtos que precisam de reposição.

## Funcionalidades

- Cadastro de produtos com validação (nome, categoria, quantidade inicial e estoque mínimo)
- Listagem ordenada por nome, com status de estoque (Normal, Estoque baixo, Sem estoque)
- Contadores: total de produtos, com estoque baixo e sem estoque
- Edição de produtos (a quantidade só muda por movimentação)
- Exclusão de produtos, com confirmação (as movimentações do produto também são excluídas)
- Pesquisa por nome em tempo real, ignorando acentos e maiúsculas
- Registro de entrada e saída, sem permitir estoque negativo
- Histórico das últimas movimentações

## Integrantes

- Emerson Luis Fantini
- Isabella Alberto Barbosa Pinheiro
- Karla Maria de Menezes Ribeiro de Sousa
- Matheus Eduardo da Silva
- Natália Batista Rodrigues
- Pedro Henrique Vilaça da Silva
- Vitor Hugo Marques Lorenço

## Tecnologias

- HTML5 semântico
- CSS3 (custom properties, Grid e Flexbox, media queries)
- JavaScript puro (ES6+), sem frameworks nem bibliotecas
- LocalStorage do navegador para guardar os dados

Não há backend, banco de dados, npm nem etapa de build.

## Como rodar

**Localmente:** baixe ou clone o repositório e dê dois cliques em `index.html`. Ele abre no navegador e funciona sem instalar nada.

**Online:** a aplicação está publicada no GitHub Pages em https://estoque-projeto-gp01.github.io/Controle-estoque/ e é atualizada automaticamente a cada merge na `main` (em *Settings > Pages*: *Deploy from a branch*, branch `main`, pasta `/ (root)`).

> Os dados ficam salvos **no navegador em que você usou a aplicação**. Abrir pelo arquivo local e abrir pelo GitHub Pages são endereços diferentes, então cada um tem seus próprios dados. Limpar os dados do site no navegador apaga o estoque.

## Estrutura de pastas

```
├── index.html            Estrutura da página (única página da aplicação)
├── css/
│   └── style.css         Estilos, variáveis de cor/espaçamento e responsividade
├── js/                   Carregados nesta ordem (com defer):
│   ├── utils.js          Funções auxiliares: gerar id, datas, normalizar texto, converter inteiro
│   ├── storage.js        Única camada que acessa o LocalStorage
│   ├── produtos.js       Regras de negócio de produtos
│   ├── movimentacao.js   Regras de entrada, saída e histórico
│   ├── ui.js             Renderização da tela e mensagens de feedback
│   └── app.js            Inicialização e ligação dos eventos
├── docs/
│   ├── prints/           Capturas de tela para a apresentação
│   ├── testes.md         Casos de teste manuais
│   └── boas-praticas.md  Boas práticas aplicadas, com exemplos do código
└── README.md
```

### Por que não usamos import/export?

ES Modules não funcionam quando o `index.html` é aberto direto do disco (`file://`), por causa das regras de segurança do navegador. Por isso, os scripts são clássicos, carregados com `<script src="..." defer>`, e a **ordem de carregamento importa**: cada arquivo só usa funções dos arquivos carregados antes dele (ou dentro de funções que só rodam depois que todos carregaram).

Como todos os arquivos compartilham o mesmo escopo global, **não crie duas funções ou constantes com o mesmo nome** em arquivos diferentes.

## Modelo de dados

Chave `estoque:produtos` no LocalStorage (lista de objetos):

```js
{
  id: "string única",
  nome: "Arroz 5kg",
  categoria: "Alimentos",   // Alimentos, Bebidas, Limpeza, Higiene, Papelaria ou Outros
  quantidade: 20,           // inteiro >= 0 (só muda por movimentação)
  estoqueMinimo: 5,         // inteiro >= 0
  criadoEm: "ISO 8601",
  atualizadoEm: "ISO 8601"
}
```

Chave `estoque:movimentacoes` (lista de objetos):

```js
{
  id: "string única",
  produtoId: "id do produto",
  tipo: "entrada" | "saida",
  quantidade: 3,            // inteiro > 0
  observacao: "opcional",
  data: "ISO 8601"
}
```

### Status do estoque

| Condição | Status |
|---|---|
| `quantidade === 0` | Sem estoque |
| `quantidade > 0` e `quantidade <= estoqueMinimo` | Estoque baixo |
| demais casos | Normal |

### Padrão de retorno das funções de negócio

Funções que alteram dados (`criarProduto`, `atualizarProduto`, `registrarMovimentacao`) devolvem sempre o mesmo formato:

```js
{ sucesso: true,  erros: {},                          produto: { ... } }
{ sucesso: false, erros: { nome: 'Informe o nome.' }, produto: null }
```

As chaves de `erros` são os nomes dos campos do modelo. O `ui.js` usa os mapas `CAMPOS_FORM_PRODUTO` e `CAMPOS_FORM_MOVIMENTACAO` para mostrar cada erro junto ao campo certo.

## Contrato de IDs do HTML

Estes IDs são usados pelo JavaScript. **Não renomeie nem remova** sem combinar com o grupo.

| Área | ID | Elemento |
|---|---|---|
| Mensagens | `mensagem` | Área de feedback (`aria-live`) |
| Resumo | `total-produtos` | Contador de produtos |
| | `total-estoque-baixo` | Contador de estoque baixo |
| | `total-sem-estoque` | Contador sem estoque |
| Form. produto | `titulo-form-produto` | Título (muda para "Editar produto") |
| | `form-produto` | Formulário |
| | `produto-id` | Campo oculto com o id em edição |
| | `produto-nome` | Nome |
| | `produto-categoria` | Categoria (select) |
| | `produto-quantidade` | Quantidade inicial (desabilitado na edição) |
| | `produto-estoque-minimo` | Estoque mínimo |
| | `btn-salvar-produto` | Botão salvar |
| | `btn-cancelar-edicao` | Botão cancelar (só na edição) |
| | `dica-produto-quantidade` | Dica exibida na edição |
| | `erro-produto-nome`, `erro-produto-categoria`, `erro-produto-quantidade`, `erro-produto-estoque-minimo` | Mensagens de erro dos campos |
| Movimentação | `form-movimentacao` | Formulário |
| | `mov-produto` | Produto (select) |
| | `mov-tipo` | Tipo: `entrada` ou `saida` (select) |
| | `mov-quantidade` | Quantidade |
| | `mov-observacao` | Observação (opcional) |
| | `btn-registrar-movimentacao` | Botão registrar |
| | `erro-mov-produto`, `erro-mov-tipo`, `erro-mov-quantidade` | Mensagens de erro dos campos |
| Listagem | `campo-pesquisa` | Pesquisa por nome |
| | `tabela-produtos` | Tabela |
| | `corpo-tabela-produtos` | `<tbody>` da tabela |
| | `lista-vazia` | Mensagem de lista vazia / nenhum resultado |
| Histórico | `tabela-movimentacoes` | Tabela |
| | `corpo-tabela-movimentacoes` | `<tbody>` da tabela |
| | `historico-vazio` | Mensagem de histórico vazio |
| Rodapé | `btn-dados-exemplo` | Carregar dados de exemplo |

Os botões "Editar" e "Excluir" de cada linha não têm ID. Eles usam `data-acao="editar"` ou `data-acao="excluir"` e `data-id="<id do produto>"`, tratados por um único listener no `<tbody>` (delegação de eventos).

## Fluxo de Git

1. Atualize a `main` antes de começar: `git checkout main` e `git pull`.
2. Crie **uma branch por tarefa**, com nome curto e descritivo:
   `git checkout -b feat/cadastro-produto`, `fix/validacao-nome`, `docs/testes`.
3. Faça commits pequenos, seguindo o padrão abaixo.
4. Envie a branch (`git push -u origin <nome-da-branch>`) e abra um **Pull Request** para a `main`.
5. Pelo menos **um colega revisa** o PR: testa no navegador, confere o contrato de IDs e as boas práticas. Ajustes pedidos entram como novos commits na mesma branch.
6. Depois de aprovado, faça o merge e apague a branch.

Ninguém faz commit direto na `main`.

## Padrão de commits (Conventional Commits)

Formato: `tipo: descrição curta no imperativo`

| Tipo | Quando usar | Exemplo |
|---|---|---|
| `feat` | Nova funcionalidade | `feat: adiciona cadastro de produtos` |
| `fix` | Correção de bug | `fix: impede saída maior que o estoque` |
| `style` | Visual/CSS ou formatação, sem mudar comportamento | `style: ajusta tabela no celular` |
| `refactor` | Melhora o código sem mudar comportamento | `refactor: extrai função de normalizar texto` |
| `docs` | Documentação | `docs: adiciona casos de teste` |
| `test` | Testes | `test: registra resultados dos testes manuais` |
