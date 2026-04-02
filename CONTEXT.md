# Contexto do Projeto - Colinho da Ca

## Visão Geral
Sistema web para gerenciamento de hospedagem de pets, desenvolvido com React + TypeScript + Vite.

## Estrutura do Projeto

```
src/
├── components/
│   ├── ui/                    # Componentes shadcn-ui
│   ├── admin/                 # Componentes admin específicos
│   ├── auth/                  # ProtectedRoute
│   ├── Navigation.tsx         # Menu principal
│   ├── ClienteForm.tsx        # Formulário de cliente
│   ├── ClienteList.tsx        # Listagem de clientes
│   ├── PetForm.tsx            # Formulário de pet
│   ├── PetList.tsx            # Listagem de pets
│   ├── ReservaForm.tsx        # Formulário de reserva
│   ├── ReservaList.tsx        # Listagem de reservas
│   ├── CupomForm.tsx          # Formulário de cupom
│   └── CupomList.tsx          # Listagem de cupons
├── lib/
│   └── api/
│       ├── config.ts          # API_BASE_URL, PaginatedResponse
│       ├── index.ts           # Exportações centralizadas
│       ├── auth/              # Autenticação JWT
│       ├── clientes/          # API de clientes
│       ├── pets/              # API de pets
│       ├── reservas/          # API de reservas
│       ├── cupons/            # API de cupons
│       └── racas/             # API de raças
├── pages/
│   ├── auth/                  # Login, Register
│   ├── admin/                 # Admin, AdminClientes, AdminPets, AdminReservas, AdminCupons
│   ├── cadastros/             # Cadastro, CadastroCliente, CadastroDados, CadastroPets, CadastroReservas
│   ├── servicos/              # Servicos, ServicoCuidados, ServicoHospedagem
│   ├── sobre/                 # Sobre, SobreHistoria, SobreContato
│   ├── Index.tsx              # Homepage
│   └── NotFound.tsx           # 404
└── App.tsx                    # Rotas principais
```

## Módulos Principais

### 1. Autenticação (JWT)
- **Login**: `/api/v1/auth/login`
- **Token**: Armazenado em localStorage
- **Headers**: Todas as requisições incluem `Authorization: Bearer {token}`
- **Serviço**: `authService` (login, logout, isAuthenticated, getAuthHeaders, getUserData, isAdmin, isCliente)
- **Proteção**: `ProtectedRoute` wrapper para rotas privadas

### 2. Clientes
- **Campos**: id, nome, email, celular, cpf, endereco, observacoes
- **Endpoints**: GET, POST, PUT, DELETE `/api/v1/clientes`
- **Paginação**: Sim (10, 25, 50, 100 registros)

### 3. Pets
- **Campos**: id, nome, porte (P/M/G), racaId, racaNome, clienteId, clienteNome, observacoes
- **Endpoints**: GET, POST, PUT, DELETE `/api/v1/pets`
- **Paginação**: Sim
- **Enum**: PortePet (P=Pequeno, M=Médio, G=Grande)

### 4. Reservas
- **Campos**: id, clienteId, clienteNome, dataInicial, dataFinal, quantidadeDiarias, quantidadePets, valorTotal, valorDesconto, observacoes, petIds, pets, status, statusTimeline, comprovantePagamento
- **Endpoints**: 
  - GET, POST, PUT, DELETE `/api/v1/reservas`
  - POST `/api/v1/reservas/{id}/confirmar` - Confirmar reserva
  - POST `/api/v1/reservas/{id}/aprovar-pagamento` - Aprovar pagamento
  - POST `/api/v1/reservas/{id}/cancelar` - Cancelar reserva
  - POST `/api/v1/reservas/{id}/desconto` - Aplicar desconto
  - POST `/api/v1/reservas/{id}/comprovante` - Enviar comprovante
  - GET `/api/v1/reservas/{id}/comprovante` - Buscar comprovante
- **Status**:
  - 1: Criada
  - 2: Confirmada
  - 3: Pagamento Pendente
  - 4: Pagamento Aprovado
  - 5: Finalizada
  - 6: Cancelada (exibida em vermelho)
- **Timeline**: Exibe progresso visual dos status (1-5), ou status cancelado (6) em vermelho
- **Desconto**: Admin pode conceder desconto no status "Criada" (1)
- **Cancelamento**: Disponível nos status "Criada" (1) e "Pagamento Pendente" (3)
- **Recursos**: Seleção de cliente, múltiplos pets (até 3), date pickers, linhas expansíveis, resumo com subtotal/desconto/total
- **Restrições**: Botões de editar/excluir ocultos para status "Finalizada" (5) e "Cancelada" (6)
- **Paginação**: Sim

### 5. Cupons
- **Campos**: id, codigo, descricao, tipo, percentual, valorFixo, minimoValorTotal, minimoPets, minimoDiarias, dataInicio, dataFim, ativo
- **Tipos**:
  1. Percentual sobre total
  2. Percentual por pet com mínimo
  3. Percentual por pet com diárias
  4. Valor fixo com mínimo
- **Endpoints**:
  - GET `/api/v1/cupons` - Listar (paginado)
  - POST `/api/v1/cupons` - Cadastrar
  - PUT `/api/v1/cupons/{id}` - Alterar
  - POST `/api/v1/cupons/{id}/inativar` - Inativar
- **Regras**: Cupom inativo não pode ser editado
- **Paginação**: Sim

### 6. Raças
- **Campos**: id, nome
- **Endpoint**: GET `/api/v1/racas`
- **Uso**: Dropdown no formulário de pets

## Navegação

### Menu Principal (Navigation.tsx)
- **Serviços**: Cuidados Especiais, Hospedagem
- **Sobre**: Nossa História, Contato
- **Administração** (apenas admin): Clientes, Pets, Reservas, Cupons
- **Painel Cliente** (apenas cliente logado): Meus Dados, Meus Pets, Minhas Reservas
- **Auth**: Login/Logout dinâmico

### Rotas
```
/ - Homepage
/login - Login
/register - Registro
/servicos/* - Serviços
/sobre/* - Sobre
/cadastro/* - Área do cliente (protegida)
/admin/* - Área administrativa (protegida)
```

## Padrões de Código

### Estrutura de Página Admin
```tsx
<div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
  <Navigation />
  <main className="container mx-auto px-4 pt-24 pb-16">
    <div className="max-w-6xl mx-auto">
      <Button variant="ghost" onClick={() => navigate("/admin")}>
        <ArrowLeft /> Voltar para Administração
      </Button>
      <div className="flex items-center gap-3 mb-8">
        <Icon className="w-10 h-10 text-primary" />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Título
        </h1>
      </div>
      {view === "list" ? <List /> : <Form />}
    </div>
  </main>
</div>
```

### Paginação Padrão
```tsx
const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(10);
// Dropdown: 10, 25, 50, 100
// Botões: ChevronLeft, ChevronRight
// Query: ?Paginacao.NumeroPagina={page}&Paginacao.QuantidadeRegistros={pageSize}
```

### API Call Pattern
```tsx
const response = await fetch(`${API_BASE_URL}/endpoint`, {
  method: "GET/POST/PUT/DELETE",
  headers: { "Content-Type": "application/json", ...getAuthHeaders() },
  body: JSON.stringify(data),
});
if (!response.ok) throw new Error("Mensagem de erro");
return response.json();
```

### CRUD Pattern
- **List Component**: Tabela + Paginação + Botões Novo/Editar/Excluir
- **Form Component**: Formulário + Validação + Loading state
- **Page Component**: Toggle entre List e Form + Navigation

## Tecnologias

- **Framework**: React 18 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn-ui
- **Routing**: React Router v6
- **State**: useState, useEffect (sem Redux)
- **HTTP**: Fetch API nativo
- **Auth**: JWT (localStorage)

## Variáveis de Ambiente

```
VITE_API_BASE_URL=http://localhost:5000
```

## Identidade Visual

- **Cores**: primary, accent, secondary (Tailwind)
- **Gradientes**: `bg-gradient-to-r from-primary to-accent`
- **Cards**: `rounded-2xl border border-border shadow-lg`
- **Ícones**: lucide-react
- **Fonte**: Sistema padrão

## Contato

- **Email**: colinhodaca@gmail.com
- **Localização**: Santos, SP
- **Endpoint**: POST `/api/v1/sobre/enviar-email`
