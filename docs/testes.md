# Casos de teste manuais

Roteiro para testar a aplicação no navegador. Para cada caso, execute os passos, anote o que aconteceu em **Resultado obtido** e marque **Status** como `Passou` ou `Falhou`.

**Execução registrada:** 23/11/2026, no site publicado no GitHub Pages, com o Chrome controlado por um roteiro que clica, digita, aceita ou cancela as confirmações, recarrega a página, fecha e reabre o navegador e simula a tela de celular. Resultado: 70 de 70 casos aprovados (o CT66 só depois da correção descrita nele).

**Antes de começar:** abra a aplicação no navegador e use uma aba anônima, ou apague os dados do site, para partir do estoque vazio. Os casos de cada seção podem depender dos casos anteriores da mesma seção.

## 1. Cadastro de produtos

| ID | Funcionalidade | Passos | Dados de entrada | Resultado esperado | Resultado obtido | Status |
|---|---|---|---|---|---|---|
| CT01 | Cadastro | Preencher todos os campos e clicar em "Cadastrar produto". | Nome: Arroz 5kg; Categoria: Alimentos; Quantidade: 20; Mínimo: 5 | Mensagem "Produto cadastrado com sucesso!". O produto aparece na tabela, o formulário fica limpo e o total de produtos vai para 1. |  Mensagem "Produto cadastrado com sucesso!". Produto na tabela (20 un., Normal). Formulário limpo. Total: 1. | Passou |
| CT02 | Cadastro | Deixar o nome vazio e clicar em "Cadastrar produto". | Nome: (vazio); Categoria: Alimentos; Quantidade: 1; Mínimo: 1 | Abaixo do campo aparece "Informe o nome do produto.", o campo fica com borda vermelha e nada é salvo. |  Erro "Informe o nome do produto.", campo com borda vermelha, nada salvo. | Passou |
| CT03 | Cadastro | Informar um nome com uma letra só. | Nome: A | Mensagem "O nome precisa ter pelo menos 2 caracteres." |  Erro "O nome precisa ter pelo menos 2 caracteres.". | Passou |
| CT04 | Cadastro | Informar um nome com espaços antes e depois. | Nome: "   Feijão 1kg   "; Categoria: Alimentos; Quantidade: 10; Mínimo: 2 | O produto é salvo como "Feijão 1kg", sem os espaços. |  Salvo como "Feijão 1kg", sem espaços nas pontas. | Passou |
| CT05 | Cadastro | Cadastrar um nome que já existe. | Nome: Arroz 5kg (já cadastrado no CT01) | Mensagem "Já existe um produto com esse nome." e nada é salvo. |  Erro "Já existe um produto com esse nome.", nada salvo. | Passou |
| CT06 | Cadastro | Cadastrar o mesmo nome com outras maiúsculas e minúsculas. | Nome: ARROZ 5KG | Mensagem "Já existe um produto com esse nome." |  Erro "Já existe um produto com esse nome.". | Passou |
| CT07 | Cadastro | Cadastrar o mesmo nome sem acento. | Cadastrar "Açúcar" e depois "acucar" | O segundo cadastro mostra "Já existe um produto com esse nome." |  "Açúcar" cadastrado; "acucar" recusado com "Já existe um produto com esse nome.". | Passou |
| CT08 | Cadastro | Não escolher a categoria. | Categoria: Selecione | Mensagem "Selecione uma categoria." |  Erro "Selecione uma categoria.". | Passou |
| CT09 | Cadastro | Informar quantidade negativa. | Quantidade: -3 | Mensagem "O valor não pode ser negativo." abaixo da quantidade. |  Erro "O valor não pode ser negativo.". | Passou |
| CT10 | Cadastro | Informar quantidade com casas decimais. | Quantidade: 2.5 | Mensagem "Use um número inteiro, sem vírgula." (se o navegador não aceitar o valor digitado, aparece "Informe a quantidade."). |  Erro "Use um número inteiro, sem vírgula.", nada salvo. | Passou |
| CT11 | Cadastro | Deixar a quantidade vazia. | Quantidade: (vazio) | Mensagem "Informe a quantidade." |  Erro "Informe a quantidade.". | Passou |
| CT12 | Cadastro | Informar estoque mínimo negativo. | Mínimo: -1 | Mensagem "O valor não pode ser negativo." abaixo do estoque mínimo. |  Erro "O valor não pode ser negativo.". | Passou |
| CT13 | Cadastro | Enviar o formulário com todos os campos vazios. | Todos vazios | Os quatro campos mostram erro, o foco vai para o campo Nome e aparece a mensagem geral de erro no topo. |  4 campos com erro, foco no campo Nome, mensagem no topo: "Verifique os campos destacados antes de salvar o produto.". | Passou |
| CT14 | Cadastro | Cadastrar um produto com quantidade zero. | Nome: Sal; Categoria: Alimentos; Quantidade: 0; Mínimo: 2 | O produto é salvo com o status "Sem estoque". |  Salvo com status "Sem estoque". | Passou |
| CT15 | Cadastro | Cadastrar com estoque mínimo zero e quantidade positiva. | Nome: Vinagre; Categoria: Alimentos; Quantidade: 4; Mínimo: 0 | O produto é salvo com o status "Normal". |  Salvo com status "Normal". | Passou |
| CT16 | Cadastro | Cadastrar um nome com código HTML. | Nome: `<b>Teste</b>` | O nome aparece na tabela exatamente como foi digitado, com os sinais < e >, sem ficar em negrito. |  Nome exibido como texto "`<b>Teste</b>`", sem negrito (não virou HTML). | Passou |

## 2. Listagem e pesquisa

| ID | Funcionalidade | Passos | Dados de entrada | Resultado esperado | Resultado obtido | Status |
|---|---|---|---|---|---|---|
| CT17 | Listagem | Abrir a aplicação com o estoque vazio. | Nenhum produto | Mensagem "Nenhum produto cadastrado ainda. Use o formulário acima para cadastrar o primeiro." e a tabela escondida. |  Mensagem exibida: "Nenhum produto cadastrado ainda. Use o formulário acima para cadastrar o primeiro.". Tabela escondida. | Passou |
| CT18 | Listagem | Cadastrar alguns produtos e conferir a tabela. | Produtos dos casos anteriores | Cada linha mostra nome, categoria, quantidade, estoque mínimo, status e os botões Editar e Excluir. |  6 linhas, todas com 6 colunas e os botões Editar e Excluir. | Passou |
| CT19 | Listagem | Conferir a ordem da tabela. | Cadastrar "Zebra", "Arroz 5kg" e "Óleo" | Ordem alfabética, ignorando acentos: Arroz 5kg, Óleo, Zebra. |  Ordem na tabela: `<b>Teste</b>`, Açúcar, Arroz 5kg, Feijão 1kg, Óleo, Sal, Vinagre, Zebra. | Passou |
| CT20 | Pesquisa | Digitar o nome completo no campo de pesquisa. | Pesquisa: Arroz 5kg | A tabela mostra só o Arroz 5kg, sem precisar apertar Enter. |  Filtrou ao digitar, sem Enter: Arroz 5kg. | Passou |
| CT21 | Pesquisa | Digitar só parte do nome. | Pesquisa: arr | Aparecem os produtos que contêm "arr" no nome. |  Resultado: Arroz 5kg. | Passou |
| CT22 | Pesquisa | Pesquisar com maiúsculas. | Pesquisa: ARROZ | Encontra o Arroz 5kg. |  Resultado: Arroz 5kg. | Passou |
| CT23 | Pesquisa | Pesquisar sem acento. | Pesquisa: acucar | Encontra o Açúcar. |  Resultado: Açúcar. | Passou |
| CT24 | Pesquisa | Pesquisar um nome que não existe. | Pesquisa: xyz | Mensagem "Nenhum produto encontrado." |  Mensagem: "Nenhum produto encontrado.". | Passou |
| CT25 | Pesquisa | Apagar o texto da pesquisa. | Pesquisa: (vazio) | Todos os produtos voltam a aparecer. |  Voltaram os 8 produtos. | Passou |
| CT26 | Pesquisa | Pesquisar e conferir os contadores do topo. | Pesquisa: arroz | Os contadores continuam mostrando o estoque inteiro, não só o resultado da pesquisa. |  Contadores com a pesquisa: 8/2/1; sem a pesquisa: 8/2/1. Iguais. | Passou |

## 3. Status e contadores

| ID | Funcionalidade | Passos | Dados de entrada | Resultado esperado | Resultado obtido | Status |
|---|---|---|---|---|---|---|
| CT27 | Status | Cadastrar um produto com quantidade maior que o mínimo. | Quantidade: 20; Mínimo: 5 | Status "Normal", em verde. |  Status "Normal", etiqueta verde. | Passou |
| CT28 | Status | Cadastrar um produto com quantidade igual ao mínimo. | Quantidade: 5; Mínimo: 5 | Status "Estoque baixo", com a linha destacada em amarelo. |  Status "Estoque baixo", linha em amarelo. | Passou |
| CT29 | Status | Cadastrar um produto com quantidade abaixo do mínimo. | Quantidade: 2; Mínimo: 10 | Status "Estoque baixo". |  Status "Estoque baixo". | Passou |
| CT30 | Status | Cadastrar um produto com quantidade zero. | Quantidade: 0; Mínimo: 5 | Status "Sem estoque", com a linha destacada em vermelho. |  Status "Sem estoque", linha em vermelho claro. | Passou |
| CT31 | Contadores | Anotar os três números do topo antes do CT27 e conferir de novo depois do CT30. | Os produtos dos casos CT27 a CT30 | Em relação aos números anotados: Total +4; Estoque baixo +2; Sem estoque +1. |  Antes: 8/2/1; depois: 12/4/2 (diferença +4/+2/+1). | Passou |
| CT32 | Contadores | Registrar uma saída que zera um produto e conferir o topo. | Saída de toda a quantidade de um produto | "Sem estoque" aumenta em 1 na hora, sem recarregar a página. |  Sem estoque foi de 2 para 3 na hora, sem recarregar. | Passou |

## 4. Edição e exclusão

| ID | Funcionalidade | Passos | Dados de entrada | Resultado esperado | Resultado obtido | Status |
|---|---|---|---|---|---|---|
| CT33 | Edição | Clicar em "Editar" em um produto. | Produto: Arroz 5kg | O formulário é preenchido com os dados do produto, o título muda para "Editar produto", o botão para "Salvar alterações" e aparece o botão "Cancelar". |  Formulário preenchido (Arroz 5kg, Alimentos, mínimo 5); título "Editar produto", botão "Salvar alterações", Cancelar visível. | Passou |
| CT34 | Edição | Conferir o campo de quantidade na edição. | Produto: Arroz 5kg | O campo de quantidade fica desabilitado, com a dica de usar entrada ou saída. |  Quantidade desabilitada, com a dica "Para alterar a quantidade, registre uma entrada ou saída." | Passou |
| CT35 | Edição | Alterar o nome e salvar. | Novo nome: Arroz Tipo 1 | Mensagem "Produto atualizado com sucesso!". O novo nome aparece na tabela e na lista "Produto" do formulário de movimentação. |  Mensagem "Produto atualizado com sucesso!". Novo nome na tabela e na lista de movimentação. | Passou |
| CT36 | Edição | Alterar só a categoria e salvar, mantendo o mesmo nome. | Categoria: Outros | O produto é salvo sem o erro de nome duplicado. |  Categoria mudou para "Outros", sem erro de duplicado. | Passou |
| CT37 | Edição | Alterar o estoque mínimo e salvar. | Mínimo: 30 | O novo mínimo aparece e o status é recalculado. A quantidade não muda. |  Mínimo 30, quantidade continua 20, status recalculado para "Estoque baixo". | Passou |
| CT38 | Edição | Trocar o nome para o de outro produto. | Nome: Açúcar (outro produto já existe) | Mensagem "Já existe um produto com esse nome." |  Erro "Já existe um produto com esse nome."; produto não foi alterado. | Passou |
| CT39 | Edição | Começar uma edição e clicar em "Cancelar". | Alterar o nome e cancelar | O formulário volta para "Cadastrar produto", vazio, e o produto não é alterado. |  Formulário voltou para "Cadastrar produto", vazio; "Açúcar" não mudou. | Passou |
| CT40 | Exclusão | Clicar em "Excluir" e confirmar. | Produto: Vinagre | O navegador pede confirmação. Depois, aparece "Produto excluído com sucesso!" e o produto sai da tabela. |  Confirmação: "Excluir "Vinagre"? As movimentações dele também serão apagadas.". Após aceitar: "Produto excluído com sucesso!" e o produto saiu da tabela. | Passou |
| CT41 | Exclusão | Clicar em "Excluir" e cancelar a confirmação. | Produto: Sal | O produto continua na tabela. |  Confirmação cancelada; "Sal" continua na tabela. | Passou |
| CT42 | Exclusão | Excluir um produto que tem movimentações. | Produto com entrada e saída registradas | O produto e as movimentações dele somem da tabela e do histórico. |  O produto tinha 2 movimentações; após excluir, ele e as movimentações sumiram da tabela e do histórico. | Passou |

## 5. Movimentação de estoque

| ID | Funcionalidade | Passos | Dados de entrada | Resultado esperado | Resultado obtido | Status |
|---|---|---|---|---|---|---|
| CT43 | Movimentação | Abrir a lista "Produto" do formulário de movimentação. | Produtos cadastrados | Todos os produtos aparecem, com a quantidade atual entre parênteses. |  10 produtos na lista, ex.: "`<b>Teste</b>` (1 em estoque)". | Passou |
| CT44 | Entrada | Registrar uma entrada. | Produto: Feijão 1kg (10); Tipo: Entrada; Quantidade: 5 | Mensagem "Entrada registrada com sucesso!" e a quantidade passa para 15. |  Mensagem "Entrada registrada com sucesso!"; quantidade foi para 15. | Passou |
| CT45 | Saída | Registrar uma saída. | Produto: Feijão 1kg (15); Tipo: Saída; Quantidade: 3 | Mensagem "Saída registrada com sucesso!" e a quantidade passa para 12. |  Mensagem "Saída registrada com sucesso!"; quantidade foi para 12. | Passou |
| CT46 | Movimentação | Registrar com quantidade zero. | Quantidade: 0 | Mensagem "Informe uma quantidade inteira maior que zero." |  Não registrou. Erro: "Informe uma quantidade inteira maior que zero.". | Passou |
| CT47 | Movimentação | Registrar com quantidade negativa. | Quantidade: -2 | Mensagem "Informe uma quantidade inteira maior que zero." |  Não registrou. Erro: "Informe uma quantidade inteira maior que zero.". | Passou |
| CT48 | Movimentação | Registrar com quantidade decimal. | Quantidade: 1.5 | A movimentação não é registrada e aparece mensagem de erro na quantidade. |  Não registrou. Erro: "Informe uma quantidade inteira maior que zero.". | Passou |
| CT49 | Saída | Tentar retirar mais do que o disponível. | Produto com 3 unidades; Saída de 10 | Mensagem "Quantidade indisponível. Há apenas 3 unidade(s) de (nome do produto) em estoque." e a quantidade não muda. |  Erro "Quantidade indisponível. Há apenas 3 unidade(s) de Açúcar em estoque."; quantidade continua 3. | Passou |
| CT50 | Saída | Retirar exatamente a quantidade disponível. | Produto com 3 unidades; Saída de 3 | A quantidade vai a 0 e o status muda para "Sem estoque". |  Quantidade 0, status "Sem estoque". | Passou |
| CT51 | Movimentação | Registrar sem escolher o produto. | Produto: Selecione um produto | Mensagem "Selecione um produto." |  Erro "Selecione um produto.". | Passou |
| CT52 | Movimentação | Registrar com observação. | Observação: Compra do fornecedor | A observação aparece no histórico. |  Histórico: 23/11/2026, 08:29 / Feijão 1kg / Entrada / 1 / Compra do fornecedor. | Passou |
| CT53 | Movimentação | Conferir a tabela depois de uma movimentação. | Qualquer entrada ou saída | A quantidade, o status e os contadores se atualizam na hora. |  Tabela mostra 13 un. (Normal); contadores 10/4/3, iguais aos dados salvos. | Passou |

## 6. Histórico de movimentações

| ID | Funcionalidade | Passos | Dados de entrada | Resultado esperado | Resultado obtido | Status |
|---|---|---|---|---|---|---|
| CT54 | Histórico | Abrir a aplicação sem movimentações. | Nenhuma movimentação | Mensagem "Nenhuma movimentação registrada ainda." |  Mensagem exibida: "Nenhuma movimentação registrada ainda.". | Passou |
| CT55 | Histórico | Registrar uma movimentação e conferir o histórico. | Entrada de 5 no Arroz 5kg | Aparece uma linha com data e hora no formato brasileiro (dd/mm/aaaa hh:mm), produto, tipo, quantidade e observação. |  Linha: 23/11/2026, 08:29 / Feijão 1kg / Entrada / 1 / Compra do fornecedor. | Passou |
| CT56 | Histórico | Conferir o tipo das movimentações. | Uma entrada e uma saída | Entrada aparece em verde e Saída em vermelho. |  Entrada com etiqueta verde e Saída com etiqueta vermelha. | Passou |
| CT57 | Histórico | Registrar várias movimentações seguidas. | Três movimentações | A mais recente aparece primeiro. |  Ordem no topo do histórico: Terceira, Segunda, Primeira. | Passou |
| CT58 | Histórico | Registrar mais de 20 movimentações. | 21 movimentações | O histórico mostra só as 20 mais recentes. |  21 movimentações salvas; o histórico mostra 20. | Passou |
| CT59 | Histórico | Registrar uma movimentação sem observação. | Observação: (vazio) | A coluna Observação mostra "-". |  Coluna Observação mostra "-". | Passou |

## 7. Armazenamento e dados de exemplo

| ID | Funcionalidade | Passos | Dados de entrada | Resultado esperado | Resultado obtido | Status |
|---|---|---|---|---|---|---|
| CT60 | Persistência | Cadastrar um produto e recarregar a página (F5). | Qualquer produto | O produto continua na tabela. |  Após F5: 12 produtos na tabela, os mesmos de antes. | Passou |
| CT61 | Persistência | Registrar uma movimentação e recarregar a página. | Qualquer movimentação | A movimentação continua no histórico e a quantidade continua atualizada. |  Após F5: histórico igual e Feijão 1kg com 16 un. | Passou |
| CT62 | Persistência | Fechar o navegador, abrir de novo e acessar o mesmo endereço. | Dados dos casos anteriores | Os dados continuam lá. |  Navegador fechado e aberto de novo: 12 produtos e histórico preservados. | Passou |
| CT63 | Persistência | Abrir a aplicação pelo arquivo local e depois pelo GitHub Pages. | Dados cadastrados em um dos dois | Cada endereço tem seus próprios dados (o navegador guarda separado por endereço). |  Pelo arquivo local: 0 produtos; pelo GitHub Pages: 12. Dados separados por endereço. | Passou |
| CT64 | Dados de exemplo | Com o estoque vazio, clicar em "Carregar dados de exemplo", no rodapé. | Estoque vazio | Mensagem "Dados de exemplo carregados com sucesso!". Aparecem 9 produtos e 5 movimentações. Contadores: 9 / 3 / 1. |  Mensagem "Dados de exemplo carregados com sucesso!"; 9 produtos, 5 movimentações, contadores 9/3/1. | Passou |
| CT65 | Dados de exemplo | Com produtos já cadastrados, clicar em "Carregar dados de exemplo". | Pelo menos 1 produto cadastrado | Mensagem "Os dados de exemplo só podem ser carregados com o estoque vazio." e nenhum dado é apagado. |  Mensagem "Os dados de exemplo só podem ser carregados com o estoque vazio."; nenhum dado apagado. | Passou |

## 8. Interface e usabilidade

| ID | Funcionalidade | Passos | Dados de entrada | Resultado esperado | Resultado obtido | Status |
|---|---|---|---|---|---|---|
| CT66 | Interface | Abrir a aplicação no navegador. | Nenhum | A página carrega sem erros visuais e sem erros no Console (F12). |  1ª execução: o Console mostrou erro 404 do favicon.ico (ícone da aba inexistente). Corrigido com um ícone embutido no index.html; na reexecução, nenhum erro no Console. Tela conferida visualmente. | Passou |
| CT67 | Mensagens | Fazer uma operação válida e outra inválida. | Um cadastro válido e outro com nome vazio | Mensagem verde no sucesso e vermelha no erro, sem janelas de alert(). |  Sucesso em verde e erro em vermelho, na área de mensagem; nenhuma janela de alert(). | Passou |
| CT68 | Responsividade | Abrir a aplicação no celular, ou no modo celular do F12 (Ctrl + Shift + M). | Largura de 375px | Formulários e cartões em uma coluna, sem barra de rolagem lateral na página. A tabela rola para o lado dentro da própria caixa. |  Em 375px: página com 375px de largura (sem rolagem lateral), formulários e cartões em 1 coluna, tabela rola dentro da caixa. Tela conferida visualmente. | Passou |
| CT69 | Teclado | Usar só o Tab, o Enter e as setas para cadastrar um produto. | Qualquer produto | Todos os campos e botões são alcançados pelo Tab, com o contorno de foco visível. |  Cadastro feito só com Tab, setas e Enter (Teclado, Bebidas); contorno de foco visível (solid 3px). | Passou |
| CT70 | Acessibilidade | Apertar Tab logo ao abrir a página. | Nenhum | Aparece o link "Pular para o conteúdo". |  Primeiro Tab focou "Pular para o conteúdo", visível no topo da página. | Passou |
