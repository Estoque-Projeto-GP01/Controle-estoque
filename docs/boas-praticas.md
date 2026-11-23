# Boas práticas aplicadas

Este documento mostra como o projeto Controle de Estoque aplica cada boa prática de desenvolvimento web exigida, com um trecho real do código como exemplo. Os trechos podem ter sido resumidos; o arquivo de origem aparece em cada seção.

## 1. Separação entre estrutura, estilo e comportamento

Cada camada fica em um arquivo próprio: o HTML descreve a estrutura, o CSS cuida da aparência e o JavaScript, do comportamento. O HTML não tem `style` nem `onclick`; ele só aponta para os outros arquivos.

```html
<link rel="stylesheet" href="css/style.css">
<script src="js/utils.js" defer></script>
<script src="js/storage.js" defer></script>
```

**Por quê:** é possível mudar o visual sem tocar na lógica, e vice-versa. Também fica claro onde procurar cada coisa. Arquivo: `index.html`.

## 2. Um arquivo JavaScript para cada responsabilidade

| Arquivo | Responsabilidade |
|---|---|
| `utils.js` | Funções auxiliares genéricas (gerar id, datas, normalizar texto) |
| `storage.js` | Única camada que acessa o LocalStorage |
| `produtos.js` | Regras de negócio dos produtos |
| `movimentacao.js` | Regras de entrada, saída e histórico |
| `ui.js` | Desenho da tela e mensagens |
| `app.js` | Inicialização e ligação dos eventos |

As regras não tocam na tela e a tela não decide regras. O status do estoque, por exemplo, é calculado em `produtos.js`, e só a cor de cada status é definida em `ui.js`:

```js
// produtos.js: a regra
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
```

**Por quê:** sete pessoas programaram em paralelo, cada uma em funções diferentes, com poucos conflitos. Um erro na tela é procurado em `ui.js`, e um erro de regra, em `produtos.js` ou `movimentacao.js`.

## 3. Só o storage.js acessa o LocalStorage

Nenhum outro arquivo usa `localStorage` diretamente. Eles chamam funções como `carregarProdutos()` e `salvarProdutos()`.

```js
const CHAVE_PRODUTOS = 'estoque:produtos';

function carregarProdutos() {
  return lerLista(CHAVE_PRODUTOS);
}
```

**Por quê:** se um dia os dados passarem a vir de um servidor, só `storage.js` muda. O prefixo `estoque:` evita conflito com outros sistemas abertos no mesmo endereço. Arquivo: `js/storage.js`.

## 4. try/catch na leitura do LocalStorage

Se os dados salvos estiverem corrompidos ou não forem uma lista, a aplicação abre com a lista vazia em vez de travar.

```js
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
```

**Por quê:** `JSON.parse` lança erro com um texto inválido. Sem o `try/catch`, um dado estragado deixaria a página em branco. Arquivo: `js/storage.js`.

## 5. Renderização com createElement e textContent (prevenção de XSS)

Tudo o que o usuário digita é exibido com `createElement`, `textContent` ou `append`, que tratam o conteúdo como texto puro. O projeto não usa `innerHTML`.

```js
function criarCelula(conteudo, classe = '') {
  const celula = document.createElement('td');
  celula.className = classe;
  celula.append(conteudo);
  return celula;
}
```

**Por quê:** com `innerHTML`, um produto chamado `<img src=x onerror="...">` executaria código na página (ataque de XSS). Com `textContent`, o nome aparece exatamente como foi digitado e nada é executado. Testamos isso cadastrando esse nome. Arquivo: `js/ui.js`.

## 6. Eventos com addEventListener

Nenhum `onclick` no HTML. Todos os eventos são ligados em um único lugar:

```js
function registrarEventos() {
  document.getElementById('form-produto').addEventListener('submit', tratarEnvioFormularioProduto);
  document.getElementById('corpo-tabela-produtos').addEventListener('click', tratarCliqueTabelaProdutos);
  document.getElementById('campo-pesquisa').addEventListener('input', tratarPesquisa);
  // ...
}
```

A tabela usa **delegação de eventos**: um único listener no `<tbody>` atende os botões Editar e Excluir de todas as linhas, inclusive as criadas depois. Cada botão informa a ação e o produto em atributos `data-`:

```js
botao.dataset.acao = acao;
botao.dataset.id = produto.id;
```

**Por quê:** o HTML fica só com estrutura, e não é preciso registrar um listener para cada botão de cada linha. Arquivos: `js/app.js` e `js/ui.js`.

## 7. Nomes descritivos em português

Variáveis e funções em camelCase (`calcularResumo`, `renderizarTabelaProdutos`, `existeNomeDuplicado`). Constantes em MAIÚSCULAS (`CHAVE_PRODUTOS`, `LIMITE_HISTORICO`, `TIPOS_MOVIMENTACAO`).

```js
const TIPOS_MOVIMENTACAO = {
  ENTRADA: 'entrada',
  SAIDA: 'saida'
};

// Quantas movimentações mostrar no histórico (as mais recentes).
const LIMITE_HISTORICO = 20;
```

**Por quê:** o nome já explica o que a função faz, sem precisar ler o corpo. As constantes evitam "números mágicos" espalhados: mudar o tamanho do histórico é mudar uma linha. Arquivo: `js/movimentacao.js`.

## 8. Funções pequenas e sem código duplicado

Cada função faz uma coisa só. Quando uma regra é usada em dois lugares, ela é reaproveitada em vez de copiada. Os contadores do topo, por exemplo, usam a mesma função de status da tabela:

```js
function calcularResumo(produtos) {
  // Reaproveita a regra de status para o contador nunca divergir da tabela.
  const status = produtos.map(calcularStatusEstoque);

  return {
    total: produtos.length,
    estoqueBaixo: status.filter((item) => item === STATUS_ESTOQUE.BAIXO).length,
    semEstoque: status.filter((item) => item === STATUS_ESTOQUE.SEM_ESTOQUE).length
  };
}
```

**Por quê:** se a regra de "estoque baixo" mudar, ela muda num lugar só, e a tabela e os contadores continuam de acordo. Arquivo: `js/produtos.js`.

## 9. Comentários que explicam o "porquê"

Os comentários não repetem o que o código já diz. Eles explicam decisões que não são óbvias:

```js
// Sem o nome, o leitor de tela anunciaria vários botões "Editar" iguais.
botao.setAttribute('aria-label', `${rotulo} ${produto.nome}`);
```

```html
<!-- novalidate: a validação é feita pelo nosso JS, com mensagens em português junto ao campo. -->
<form id="form-produto" class="formulario" novalidate>
```

**Por quê:** quem lê o código entende a intenção e não "corrige" algo que foi feito de propósito.

## 10. 'use strict' e scripts sem módulos

Todos os arquivos JavaScript começam com `'use strict'`, que transforma erros silenciosos (como usar uma variável não declarada) em erros visíveis.

Os scripts são carregados com `defer`, na ordem certa, em vez de `import`/`export`:

```html
<!--
  Scripts clássicos com "defer": rodam na ordem abaixo, depois que o HTML
  foi lido. Não usamos import/export porque ES Modules não funcionam ao
  abrir o arquivo direto no navegador (file://).
-->
```

**Por quê:** a aplicação precisa funcionar com um duplo clique no `index.html`, sem servidor, e também no GitHub Pages.

## 11. HTML semântico

A página usa as tags pelo significado: `header`, `main`, `section`, `form`, `table` com `caption` e `th scope="col"`, e `footer`. Cada seção é ligada ao seu título com `aria-labelledby`.

```html
<section class="painel" aria-labelledby="titulo-form-produto">
  <h2 id="titulo-form-produto" class="painel__titulo">Cadastrar produto</h2>
```

**Por quê:** navegadores, leitores de tela e buscadores entendem a estrutura da página, e o código fica mais legível do que com `div` em tudo. Arquivo: `index.html`.

## 12. Acessibilidade

- **Label ligado a cada campo** com `for`, e a mensagem de erro ligada ao campo com `aria-describedby`:

  ```html
  <label for="produto-nome">Nome do produto</label>
  <input type="text" id="produto-nome" ... aria-describedby="erro-produto-nome">
  <p id="erro-produto-nome" class="campo__erro"></p>
  ```

- **Mensagens anunciadas** pelo leitor de tela com `aria-live`:

  ```html
  <div id="mensagem" class="mensagem" role="status" aria-live="polite"></div>
  ```

- **Foco visível** para quem navega pelo teclado:

  ```css
  :focus-visible {
    outline: 3px solid var(--cor-foco);
    outline-offset: 2px;
  }
  ```

- **Contraste:** as cores de texto e fundo foram escolhidas com contraste de pelo menos 4,5:1 (nível AA da WCAG).
- **Link "Pular para o conteúdo"**, que aparece ao apertar Tab, e áreas de toque de pelo menos 44px no celular.

Arquivos: `index.html` e `css/style.css`.

## 13. CSS organizado com variáveis

Cores e espaçamentos ficam em custom properties no `:root`, e o resto do CSS só as reutiliza:

```css
:root {
  --cor-primaria: #1d4ed8;
  --cor-perigo: #b91c1c;
  --espaco-md: 1rem;
  --raio: 8px;
}

.painel {
  border-radius: var(--raio);
  padding: var(--espaco-lg);
}
```

**Por quê:** para mudar a cor principal do sistema, basta alterar uma linha. O arquivo segue uma ordem fixa: variáveis, base, layout, componentes e responsivo. Arquivo: `css/style.css`.

## 14. Layout responsivo

Grid e Flexbox, com dois pontos de quebra (`@media`). No celular, os formulários e os cartões de resumo ficam em uma coluna, e as tabelas rolam para o lado em vez de estourar a página. Testamos em larguras de 320px a 1280px.

```css
@media (max-width: 800px) {
  .grade-formularios {
    grid-template-columns: 1fr;
  }
}
```

Arquivo: `css/style.css`.

## 15. Validação com mensagens claras, sem alert()

Os erros aparecem junto ao campo e numa área de mensagens, nunca em `alert()`. A mensagem diz o que fazer:

```js
erros.quantidade = `Quantidade indisponível. Há apenas ${produto.quantidade} unidade(s) de ${produto.nome} em estoque.`;
```

**Por quê:** o `alert()` trava a página e some sem deixar rastro. A mensagem junto ao campo mostra onde está o problema. O `confirm()` é usado só antes de excluir, porque a exclusão não pode ser desfeita. Arquivo: `js/movimentacao.js`.

## 16. Trabalho em equipe com Git

- **Uma branch por tarefa** (`feat/listagem-produtos`, `feat/movimentacao-estoque`, ...).
- **Pull Request com revisão** de outro integrante antes de entrar na `main`. A revisão inclui testar no navegador.
- **Padrão de commits Conventional Commits** (`feat:`, `fix:`, `docs:`), definido no README e usado nos títulos dos Pull Requests.
- **Contrato de IDs e de funções definido antes** no README e em funções vazias com comentários, para todos programarem em paralelo contra a mesma interface.

**Por quê:** o histórico mostra quem fez o quê, os erros são pegos na revisão e ninguém sobrescreve o trabalho de outra pessoa.
