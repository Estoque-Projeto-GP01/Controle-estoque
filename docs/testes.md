## 5. Casos de teste

### 5.1. Cadastro de produtos

| ID | Teste | Procedimento | Resultado esperado | Status |
|---|---|---|---|---|
| CT001 | Cadastro válido | Informar nome, categoria, quantidade e estoque mínimo válidos e clicar em salvar. | Produto cadastrado e exibido na listagem. | Pendente |
| CT002 | Nome vazio | Tentar cadastrar um produto sem informar o nome. | Sistema deve apresentar mensagem de erro. | Pendente |
| CT003 | Nome com apenas um caractere | Informar um nome com apenas uma letra. | Sistema deve impedir o cadastro. | Pendente |
| CT004 | Nome com espaços | Informar nome com espaços antes e depois. | Sistema deve remover os espaços desnecessários. | Pendente |
| CT005 | Produto duplicado | Cadastrar dois produtos com o mesmo nome. | Sistema deve impedir nomes duplicados. | Pendente |
| CT006 | Duplicidade de letras | Cadastrar "Arroz" e depois "arroz". | Sistema deve identificar a duplicidade. | Pendente |
| CT007 | Categoria não selecionada | Tentar cadastrar sem selecionar uma categoria. | Sistema deve apresentar mensagem de validação. | Pendente |
| CT008 | Quantidade negativa | Informar quantidade menor que zero. | Sistema deve impedir o cadastro. | Pendente |
| CT009 | Quantidade decimal | Informar quantidade com casas decimais. | Sistema deve impedir o cadastro. | Pendente |
| CT010 | Estoque mínimo negativo | Informar estoque mínimo menor que zero. | Sistema deve impedir o cadastro. | Pendente |
| CT011 | Quantidade igual a zero | Cadastrar produto com quantidade zero. | Produto deve apresentar status Sem estoque. | Pendente |
| CT012 | Estoque mínimo igual a zero | Cadastrar produto com estoque mínimo zero e quantidade positiva. | Produto deve apresentar status Normal. | Pendente |

### 5.2. Listagem e consulta de produtos

| ID | Teste | Procedimento | Resultado esperado | Status |
|---|---|---|---|---|
| CT013 | Listagem de produtos | Cadastrar diferentes produtos e acessar a listagem. | Todos os produtos devem aparecer corretamente. | Pendente |
| CT014 | Ordenação alfabética | Cadastrar produtos com nomes diferentes. | Produtos devem aparecer em ordem alfabética. | Pendente |
| CT015 | Pesquisa por nome | Digitar o nome de um produto no campo de pesquisa. | Sistema deve apresentar o produto correspondente. | Pendente |
| CT016 | Pesquisa parcial | Digitar apenas parte do nome. | Sistema deve localizar os produtos correspondentes. | Pendente |
| CT017 | Pesquisa sem diferenciar maiúsculas | Pesquisar utilizando letras maiúsculas e minúsculas. | Sistema deve localizar o mesmo produto. | Pendente |
| CT018 | Pesquisa sem acentos | Pesquisar um produto sem utilizar seus acentos. | Sistema deve localizar o produto correspondente. | Pendente |
| CT019 | Pesquisa sem resultados | Informar um nome inexistente. | Sistema deve informar que nenhum resultado foi encontrado. | Pendente |
| CT020 | Limpar pesquisa | Apagar o conteúdo do campo de pesquisa. | Todos os produtos devem voltar a ser exibidos. | Pendente |

### 5.3. Status e resumo do estoque

| ID | Teste | Procedimento | Resultado esperado | Status |
|---|---|---|---|---|
| CT021 | Estoque normal | Cadastrar produto com quantidade maior que o estoque mínimo. | Status apresentado como Normal. | Pendente |
| CT022 | Estoque baixo | Cadastrar produto com quantidade positiva igual ao estoque mínimo. | Status apresentado como Estoque baixo. | Pendente |
| CT023 | Estoque sem unidades | Cadastrar produto com quantidade zero. | Status apresentado como Sem estoque. | Pendente |
| CT024 | Contador de produtos | Cadastrar três produtos diferentes. | Total de produtos deve apresentar 3. | Pendente |
| CT025 | Contador de estoque baixo | Cadastrar produtos com diferentes níveis de estoque. | Contador deve apresentar a quantidade correta de produtos com estoque baixo. | Pendente |
| CT026 | Contador sem estoque | Cadastrar produtos com quantidade zero. | Contador deve apresentar a quantidade correta de produtos sem estoque. | Pendente |

### 5.4. Edição e exclusão de produtos

| ID | Teste | Procedimento | Resultado esperado | Status |
|---|---|---|---|---|
| CT027 | Editar produto | Selecionar a opção Editar em um produto. | Formulário deve apresentar os dados atuais do produto. | Pendente |
| CT028 | Alterar nome | Modificar o nome de um produto e salvar. | Novo nome deve aparecer na listagem. | Pendente |
| CT029 | Alterar categoria | Modificar a categoria de um produto. | Nova categoria deve ser apresentada corretamente. | Pendente |
| CT030 | Alterar estoque mínimo | Modificar o estoque mínimo de um produto. | Novo valor deve ser salvo. | Pendente |
| CT031 | Impedir alteração direta da quantidade | Abrir a edição de um produto. | Campo de quantidade deve permanecer desabilitado. | Pendente |
| CT032 | Cancelar edição | Iniciar uma edição e clicar em cancelar. | Alterações não salvas devem ser descartadas. | Pendente |
| CT033 | Excluir produto | Selecionar Excluir e confirmar a operação. | Produto deve desaparecer da listagem. | Pendente |
| CT034 | Cancelar exclusão | Selecionar Excluir e cancelar a confirmação. | Produto deve continuar cadastrado. | Pendente |
| CT035 | Excluir produto com movimentações | Excluir um produto que possua histórico de movimentações. | Produto e suas movimentações devem ser excluídos. | Pendente |

### 5.5. Movimentação de estoque

| ID | Teste | Procedimento | Resultado esperado | Status |
|---|---|---|---|---|
| CT036 | Registrar entrada | Selecionar um produto, escolher Entrada e informar quantidade válida. | Quantidade do estoque deve aumentar. | Pendente |
| CT037 | Registrar saída | Selecionar um produto, escolher Saída e informar quantidade válida. | Quantidade do estoque deve diminuir. | Pendente |
| CT038 | Entrada com quantidade zero | Tentar registrar entrada com quantidade zero. | Sistema deve impedir a movimentação. | Pendente |
| CT039 | Saída com quantidade zero | Tentar registrar saída com quantidade zero. | Sistema deve impedir a movimentação. | Pendente |
| CT040 | Quantidade negativa | Informar quantidade negativa na movimentação. | Sistema deve apresentar mensagem de erro. | Pendente |
| CT041 | Quantidade decimal | Informar quantidade decimal na movimentação. | Sistema deve impedir a operação. | Pendente |
| CT042 | Saída maior que o estoque | Tentar retirar quantidade superior à disponível. | Sistema deve impedir a operação e informar a quantidade disponível. | Pendente |
| CT043 | Saída de todo o estoque | Retirar exatamente a quantidade disponível. | Estoque deve chegar a zero e apresentar status Sem estoque. | Pendente |
| CT044 | Movimentação sem produto | Tentar registrar movimentação sem selecionar produto. | Sistema deve solicitar a seleção de um produto. | Pendente |
| CT045 | Tipo de movimentação inválido | Tentar registrar movimentação sem selecionar um tipo válido. | Sistema deve apresentar mensagem de validação. | Pendente |
| CT046 | Observação da movimentação | Registrar uma movimentação com observação preenchida. | Observação deve ser armazenada junto à movimentação. | Pendente |
| CT047 | Atualização após movimentação | Registrar entrada ou saída e consultar a listagem. | Quantidade e status devem ser atualizados automaticamente. | Pendente |

### 5.6. Histórico de movimentações

| ID | Teste | Procedimento | Resultado esperado | Status |
|---|---|---|---|---|
| CT048 | Consultar histórico | Registrar uma movimentação e acessar o histórico. | Movimentação deve aparecer no histórico. | Pendente |
| CT049 | Histórico de entradas | Registrar uma entrada de produto. | Histórico deve identificar o tipo Entrada. | Pendente |
| CT050 | Histórico de saídas | Registrar uma saída de produto. | Histórico deve identificar o tipo Saída. | Pendente |
| CT051 | Ordenação do histórico | Registrar várias movimentações em sequência. | Movimentações mais recentes devem aparecer primeiro. | Pendente |
| CT052 | Limite do histórico | Registrar mais de 20 movimentações. | Histórico deve apresentar somente as 20 mais recentes. | Pendente |
| CT053 | Histórico vazio | Acessar o sistema sem movimentações registradas. | Sistema deve apresentar mensagem de histórico vazio. | Pendente |

### 5.7. Armazenamento e persistência dos dados

| ID | Teste | Procedimento | Resultado esperado | Status |
|---|---|---|---|---|
| CT054 | Salvar produtos | Cadastrar um produto e atualizar a página. | Produto deve continuar cadastrado. | Pendente |
| CT055 | Salvar movimentações | Registrar uma movimentação e atualizar a página. | Movimentação deve continuar no histórico. | Pendente |
| CT056 | Persistência dos dados | Fechar e abrir novamente o navegador no mesmo endereço da aplicação. | Dados devem permanecer armazenados. | Pendente |
| CT057 | Separação dos ambientes | Abrir a aplicação localmente e pelo GitHub Pages. | Cada endereço deve possuir seu próprio armazenamento. | Pendente |
| CT058 | Carregar dados de exemplo | Clicar no botão de dados de exemplo. | Sistema deve carregar os produtos e movimentações demonstrativos. | Pendente |

### 5.8. Interface e usabilidade

| ID | Teste | Procedimento | Resultado esperado | Status |
|---|---|---|---|---|
| CT059 | Exibição inicial | Abrir a aplicação no navegador. | Tela deve carregar corretamente, sem erros visuais. | Pendente |
| CT060 | Mensagens de feedback | Executar uma operação válida e outra inválida. | Sistema deve apresentar mensagens adequadas. | Pendente |
| CT061 | Responsividade | Abrir a aplicação em uma tela de celular. | Elementos devem se adaptar ao tamanho da tela. | Pendente |
| CT062 | Navegação | Utilizar formulários, botões e campos do sistema. | Elementos devem funcionar corretamente. | Pendente |
| CT063 | Atualização dos contadores | Realizar cadastro, exclusão e movimentações. | Indicadores devem refletir os dados atuais. | Pendente |# Casos de teste manuais


