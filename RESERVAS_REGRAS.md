# Regras de Negócio - Tela de Reservas

## Visão Geral
Sistema de gerenciamento de reservas de hospedagem de pets com controle de status, timeline visual, descontos e cancelamentos.

---

## Status da Reserva

### Estados Possíveis
1. **Status 1 - Criada**: Reserva recém-criada, aguardando confirmação
2. **Status 2 - Confirmada**: Reserva confirmada pelo admin
3. **Status 3 - Pagamento Pendente**: Cliente enviou comprovante, aguardando aprovação
4. **Status 4 - Pagamento Aprovado**: Pagamento aprovado pelo admin
5. **Status 5 - Finalizada**: Reserva concluída
6. **Status 6 - Cancelada**: Reserva cancelada (exibida em vermelho)

### Fluxo de Status
```
Criada (1) → Confirmada (2) → Pag. Pendente (3) → Pag. Aprovado (4) → Finalizada (5)
                ↓                        ↓
            Cancelada (6)           Cancelada (6)
```

---

## Regras de Criação

### Campos Obrigatórios
- Cliente (seleção via dropdown)
- Pelo menos 1 pet (máximo 3 pets)
- Data inicial
- Data final
- Quantidade de diárias (calculada automaticamente)
- Quantidade de pets (calculada automaticamente)
- Valor total (calculado automaticamente)

### Validações de Data
- Data inicial não pode ser anterior à data atual
- Data final não pode ser anterior à data inicial
- Data final não pode ser anterior à data atual
- Quantidade de diárias = diferença entre data final e inicial (mínimo 1 dia)

### Cálculo de Valores
- **Valor da diária**: R$ 85,00 por pet por dia
- **Valor por pet**: Diárias × R$ 85,00
- **Subtotal**: Soma dos valores de todos os pets
- **Desconto**: Valor aplicado pelo admin (padrão: R$ 0,00)
- **Total**: Subtotal - Desconto

### Seleção de Pets
- Máximo de 3 pets por reserva
- Pets devem pertencer ao cliente selecionado
- Ao trocar o cliente, a seleção de pets é resetada
- Exibe mensagem se o cliente não possui pets cadastrados

---

## Regras de Edição

### Permissões de Edição
- **Status 1-4**: Pode editar dados da reserva
- **Status 5 (Finalizada)**: NÃO pode editar
- **Status 6 (Cancelada)**: NÃO pode editar

### Campos Editáveis
- Cliente
- Pets (até 3)
- Data inicial
- Data final
- Observações

### Botões Ocultos
- Botões de "Editar" e "Excluir" não aparecem para reservas com status 5 ou 6

---

## Regras de Exclusão

### Permissões de Exclusão
- **Status 1-4**: Pode excluir
- **Status 5 (Finalizada)**: NÃO pode excluir
- **Status 6 (Cancelada)**: NÃO pode excluir

### Confirmação
- Exibe dialog de confirmação antes de excluir
- Ação irreversível

---

## Sistema de Desconto

### Permissões
- **Apenas Admin** pode conceder desconto
- **Apenas no Status 1 (Criada)** o botão aparece

### Funcionalidades
- Botão "Conceder Desconto" no painel de resumo
- Modal com campo para valor do desconto
- Validações:
  - Valor não pode ser negativo
  - Valor não pode ser maior que o subtotal
- Resumo em tempo real no modal:
  - Subtotal
  - Desconto
  - Total

### Exibição
- **Subtotal**: Sempre exibido (valor sem desconto)
- **Desconto**: Sempre exibido em verde (mesmo quando R$ 0,00)
- **Total**: Sempre exibido (subtotal - desconto)

---

## Sistema de Cancelamento

### Permissões de Cancelamento
- **Status 1 (Criada)**: Pode cancelar
- **Status 3 (Pagamento Pendente)**: Pode cancelar
- **Status 2, 4, 5, 6**: NÃO pode cancelar

### Funcionalidades
- Botão "Cancelar Reserva" em vermelho
- Dialog de confirmação antes de cancelar
- Ação irreversível
- Ao cancelar, status muda para 6 (Cancelada)

### Exibição do Status Cancelado
- Timeline normal (status 1-5) é substituída por indicador único
- Ícone X em círculo vermelho
- Texto "Cancelada" em vermelho
- Não exibe os outros status quando cancelada

---

## Sistema de Confirmação

### Permissões
- **Apenas Admin** pode confirmar
- **Apenas no Status 1 (Criada)** o botão aparece

### Funcionalidades
- Botão "Confirmar Reserva" no formulário
- Dialog de confirmação
- Ao confirmar, status muda para 2 (Confirmada)

---

## Sistema de Comprovante de Pagamento

### Upload de Comprovante (Cliente)
- Disponível no Status 2 (Confirmada)
- Cliente envia comprovante em base64
- Pode adicionar observações sobre o pagamento
- Ao enviar, status muda para 3 (Pagamento Pendente)

### Visualização de Comprovante (Admin)
- Botão "Ver Comprovante" no Status 3
- Exibe comprovante em iframe
- Exibe observações do pagamento
- Exibe data do pagamento

### Aprovação de Pagamento (Admin)
- Botão "Aprovar Pagamento" no Status 3
- Ao aprovar, status muda para 4 (Pagamento Aprovado)

---

## Timeline Visual

### Exibição Normal (Status 1-5)
- 5 círculos representando os status
- Status ativo: círculo preenchido com check
- Status inativo: círculo vazio
- Linhas conectoras entre os status
- Linha preenchida quando status seguinte está ativo

### Exibição Cancelada (Status 6)
- Substitui toda a timeline
- Círculo vermelho com X
- Texto "Cancelada" em vermelho
- Centralizado

### Labels dos Status
- Status 1: "Criada"
- Status 2: "Confirmada"
- Status 3: "Pag. Pendente"
- Status 4: "Pag. Aprovado"
- Status 5: "Finalizada"
- Status 6: "Cancelada"

---

## Resumo Financeiro

### Painel de Resumo (Sempre Visível)
- **Diárias**: Quantidade calculada
- **Pets**: Quantidade selecionada
- **Valores por Pet**: Lista com nome e valor individual
- **Subtotal**: Valor total sem desconto
- **Desconto**: Valor do desconto (sempre visível, mesmo R$ 0,00)
- **Total**: Valor final (subtotal - desconto)

### Cores
- Subtotal: Texto normal
- Desconto: Verde (indica economia)
- Total: Cor primária, destaque maior

---

## Listagem de Reservas

### Informações Exibidas na Tabela
- Cliente
- Quantidade de pets
- Quantidade de diárias
- Data início
- Data fim
- Valor total (na coluna principal)

### Informações Expandidas
- Período completo
- Diárias
- Quantidade de pets
- **Subtotal**
- **Desconto**
- **Valor Final**
- Lista de pets
- Timeline de status
- Botões de ação (conforme status)

### Botões de Ação (Status 1)
- Confirmar Reserva
- Cancelar Reserva

### Botões de Ação (Status 3)
- Ver Comprovante
- Aprovar Pagamento
- Cancelar Reserva

---

## Paginação

### Opções
- 10 registros por página
- 25 registros por página
- 50 registros por página
- 100 registros por página

### Navegação
- Botão "Anterior"
- Indicador de página atual
- Botão "Próxima"
- Desabilita botões nos limites

---

## Filtros

### Filtro por Cliente (Admin)
- Dropdown para selecionar cliente
- Filtra reservas do cliente selecionado

### Filtro Automático (Cliente)
- Cliente logado vê apenas suas próprias reservas
- Filtro aplicado automaticamente via ClienteId

---

## Permissões por Perfil

### Admin
- Ver todas as reservas
- Criar reservas para qualquer cliente
- Editar reservas (status 1-4)
- Excluir reservas (status 1-4)
- Confirmar reservas (status 1)
- Conceder desconto (status 1)
- Ver comprovante (status 3)
- Aprovar pagamento (status 3)
- Cancelar reservas (status 1 e 3)

### Cliente
- Ver apenas suas reservas
- Criar reservas para si mesmo
- Editar suas reservas (status 1-4)
- Enviar comprovante (status 2)
- Ver suas reservas canceladas/finalizadas (somente leitura)

---

## Validações de Segurança

### Backend
- Validar se cliente tem permissão para acessar/modificar reserva
- Validar transições de status
- Validar se pets pertencem ao cliente
- Validar datas
- Validar valores calculados

### Frontend
- Ocultar botões conforme permissões
- Validar campos obrigatórios
- Validar datas antes de enviar
- Confirmar ações destrutivas (excluir, cancelar)

---

## Mensagens de Feedback

### Sucesso
- "Reserva cadastrada com sucesso"
- "Reserva atualizada com sucesso"
- "Reserva confirmada com sucesso"
- "Desconto aplicado com sucesso"
- "Pagamento aprovado com sucesso"
- "Reserva cancelada com sucesso"
- "Reserva excluída com sucesso"

### Erro
- "Campos obrigatórios: Preencha cliente, pelo menos 1 pet, data início e data fim"
- "Datas inválidas: A data inicial não pode ser maior que a data final"
- "Data inválida: A data não pode ser anterior a hoje"
- "Valor de desconto inválido"
- "Erro ao carregar clientes/pets/reservas"
- "Erro ao salvar/atualizar/excluir reserva"

---

## Observações Técnicas

### Formato de Datas
- **Entrada**: yyyy-MM-dd
- **Exibição**: dd/MM/yyyy
- **API**: yyyy-MM-ddT00:00:00

### Formato de Valores
- **Moeda**: R$ 0.00 (2 casas decimais)
- **Cálculos**: Sempre em centavos para evitar erros de arredondamento

### Estados de Loading
- Spinner durante carregamento de dados
- Botões desabilitados durante operações
- Feedback visual em todas as ações

### Responsividade
- Layout adaptável para mobile/tablet/desktop
- Grid de 2 colunas no formulário (desktop)
- Coluna única no mobile
- Painel de resumo lateral (desktop) ou abaixo (mobile)
