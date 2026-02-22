# Regras de Negócio - Tela de Cupons

## Visão Geral
Sistema de gerenciamento de cupons de desconto com diferentes tipos, validações de período e controle de uso.

---

## Tipos de Cupom

### 1. Percentual (%)
- Desconto em percentual sobre o valor total
- Exemplo: 10% de desconto
- Campo: `tipoDesconto = 1`

### 2. Valor Fixo (R$)
- Desconto em valor fixo
- Exemplo: R$ 50,00 de desconto
- Campo: `tipoDesconto = 2`

---

## Campos do Cupom

### Obrigatórios
- **Código**: Identificador único do cupom (letras maiúsculas)
- **Tipo de Desconto**: Percentual ou Valor Fixo
- **Valor do Desconto**: Valor numérico (% ou R$)
- **Data Início**: Data de início da validade
- **Data Fim**: Data de término da validade

### Opcionais
- **Descrição**: Texto descritivo sobre o cupom
- **Quantidade Máxima**: Limite de usos (0 = ilimitado)

### Automáticos
- **Ativo**: Status do cupom (padrão: true)
- **Quantidade Utilizada**: Contador de usos (padrão: 0)

---

## Regras de Criação

### Validações de Código
- Código é convertido automaticamente para maiúsculas
- Deve ser único no sistema
- Formato sugerido: DESCONTO50, PRIMEIRAHOSP, VERAO2024

### Validações de Valor
- Valor do desconto deve ser maior que 0
- Para percentual: geralmente entre 1% e 100%
- Para valor fixo: qualquer valor positivo

### Validações de Data
- Data início não pode ser posterior à data fim
- Ambas as datas são obrigatórias
- Formato: yyyy-MM-dd

### Quantidade Máxima
- 0 = uso ilimitado
- Valor positivo = limite de usos
- Quando atingir o limite, cupom não pode mais ser usado

---

## Regras de Edição

### Campos Editáveis
- Código
- Descrição
- Tipo de desconto
- Valor do desconto
- Data início
- Data fim
- Quantidade máxima

### Restrições
- Não pode editar se cupom estiver inativo (deve ativar primeiro)
- Quantidade utilizada não pode ser editada manualmente

---

## Sistema de Ativação/Desativação

### Ativar Cupom
- Botão com ícone de Power
- Cupom ativo pode ser usado pelos clientes
- Badge verde "Ativo"

### Desativar Cupom
- Botão com ícone de Power
- Cupom inativo não pode ser usado
- Badge vermelho "Inativo"
- Mantém histórico de uso

### Diferença entre Inativar e Excluir
- **Inativar**: Preserva dados e histórico, pode ser reativado
- **Excluir**: Remove permanentemente do sistema

---

## Regras de Exclusão

### Permissões
- Apenas Admin pode excluir
- Exibe dialog de confirmação
- Ação irreversível

### Considerações
- Perde todo o histórico de uso
- Preferível inativar em vez de excluir

---

## Listagem de Cupons

### Colunas Exibidas
1. **Código**: Identificador do cupom
2. **Descrição**: Texto descritivo
3. **Tipo**: Percentual ou Valor Fixo
4. **Valor**: Formatado conforme tipo (% ou R$)
5. **Início**: Data de início (dd/MM/yyyy)
6. **Fim**: Data de término (dd/MM/yyyy)
7. **Uso**: Quantidade utilizada / Máxima (∞ se ilimitado)
8. **Status**: Badge Ativo/Inativo
9. **Ações**: Botões de ação

### Formatação de Valores
- Percentual: `10%`
- Valor Fixo: `R$ 50.00`
- Uso ilimitado: `5/∞`
- Uso limitado: `5/10`

### Cores de Status
- **Ativo**: Badge verde (bg-green-100 text-green-800)
- **Inativo**: Badge vermelho (bg-red-100 text-red-800)

---

## Botões de Ação

### Ativar/Desativar (Power)
- Ícone: Power
- Cor: Outline
- Função: Alterna status ativo/inativo
- Sempre visível

### Editar (Pencil)
- Ícone: Pencil
- Cor: Outline
- Função: Abre formulário de edição
- Sempre visível

### Excluir (Trash)
- Ícone: Trash2
- Cor: Destructive (vermelho)
- Função: Exclui cupom permanentemente
- Exige confirmação

---

## Paginação

### Opções
- 10 registros por página
- 25 registros por página
- 50 registros por página
- 100 registros por página

### Navegação
- Botão "Anterior" (desabilitado na primeira página)
- Indicador "Página X de Y"
- Botão "Próxima" (desabilitado na última página)

---

## Validações de Uso (Cliente)

### Verificações ao Aplicar Cupom
1. **Cupom existe**: Código válido no sistema
2. **Cupom ativo**: Status = true
3. **Dentro do período**: Data atual entre início e fim
4. **Limite de uso**: Quantidade utilizada < máxima (se não for ilimitado)
5. **Valor mínimo**: Se houver, pedido deve atingir valor mínimo

### Aplicação do Desconto
- **Percentual**: `desconto = valorTotal * (percentual / 100)`
- **Valor Fixo**: `desconto = valorFixo`
- Desconto não pode ser maior que o valor total

---

## Mensagens de Feedback

### Sucesso
- "Cupom cadastrado com sucesso"
- "Cupom atualizado com sucesso"
- "Status do cupom alterado com sucesso"
- "Cupom excluído com sucesso"

### Erro
- "Campos obrigatórios: Preencha código, valor, data início e data fim"
- "Erro ao carregar cupons"
- "Erro ao salvar cupom"
- "Erro ao alterar status do cupom"
- "Erro ao excluir cupom"

### Validação de Uso (Cliente)
- "Cupom inválido ou expirado"
- "Cupom já atingiu o limite de uso"
- "Valor mínimo não atingido para usar este cupom"

---

## Permissões por Perfil

### Admin
- Ver todos os cupons
- Criar novos cupons
- Editar cupons existentes
- Ativar/desativar cupons
- Excluir cupons
- Ver estatísticas de uso

### Cliente
- Ver cupons ativos e válidos
- Aplicar cupom em suas reservas
- Ver histórico de cupons usados

---

## Observações Técnicas

### Formato de Datas
- **Entrada**: yyyy-MM-dd
- **Exibição**: dd/MM/yyyy
- **API**: yyyy-MM-ddT00:00:00

### Formato de Valores
- **Percentual**: Número inteiro ou decimal (ex: 10, 15.5)
- **Valor Fixo**: Decimal com 2 casas (ex: 50.00)
- **Moeda**: R$ 0.00

### Estados de Loading
- Spinner durante carregamento
- Botões desabilitados durante operações
- Feedback visual em todas as ações

### Conversão Automática
- Código sempre em maiúsculas
- Valores numéricos validados
- Datas formatadas corretamente

---

## Fluxo de Uso do Cupom

```
1. Admin cria cupom
2. Admin ativa cupom
3. Cliente visualiza cupons disponíveis
4. Cliente aplica cupom na reserva
5. Sistema valida cupom
6. Sistema aplica desconto
7. Sistema incrementa quantidade utilizada
8. Cliente finaliza reserva com desconto
```

---

## Regras de Validação de Período

### Cupom Válido
- Data atual >= Data início
- Data atual <= Data fim
- Status = Ativo

### Cupom Expirado
- Data atual > Data fim
- Não pode ser usado
- Pode ser reativado alterando data fim

### Cupom Futuro
- Data atual < Data início
- Não pode ser usado ainda
- Aguardando data de início

---

## Estatísticas e Relatórios

### Informações Disponíveis
- Total de cupons cadastrados
- Cupons ativos vs inativos
- Taxa de uso por cupom
- Cupons mais utilizados
- Valor total de descontos concedidos

### Métricas por Cupom
- Quantidade utilizada
- Quantidade restante (se limitado)
- Taxa de conversão
- Valor médio de desconto aplicado
