# Template de Prompt para Criação de Sites

## Instruções de Uso
1. Copie este template
2. Substitua as seções `[PERSONALIZAR]` com as informações do seu novo projeto
3. Use como prompt inicial para criar novos sites

---

# Contexto do Projeto - [PERSONALIZAR: Nome do Projeto]

## Visão Geral
[PERSONALIZAR: Descrição do sistema - ex: Sistema web para gerenciamento de loja online, Sistema de agendamento médico, etc.]

Desenvolver com React + TypeScript + Vite seguindo a arquitetura e padrões estabelecidos.

## Estrutura do Projeto Base

```
src/
├── components/
│   ├── ui/                    # Componentes shadcn-ui
│   ├── admin/                 # Componentes admin específicos
│   ├── auth/                  # ProtectedRoute
│   ├── Navigation.tsx         # Menu principal
│   └── [PERSONALIZAR: Componentes específicos do domínio]
├── lib/
│   └── api/
│       ├── config.ts          # API_BASE_URL, PaginatedResponse
│       ├── index.ts           # Exportações centralizadas
│       ├── auth/              # Autenticação JWT
│       └── [PERSONALIZAR: Módulos de API específicos]
├── pages/
│   ├── auth/                  # Login, Register
│   ├── admin/                 # Páginas administrativas
│   ├── [PERSONALIZAR: Módulos específicos]
│   ├── Index.tsx              # Homepage
│   └── NotFound.tsx           # 404
└── App.tsx                    # Rotas principais
```

## Módulos Principais

### 1. Autenticação (JWT) - PADRÃO
- **Login**: `/api/v1/auth/login`
- **Token**: Armazenado em localStorage
- **Headers**: Todas as requisições incluem `Authorization: Bearer {token}`
- **Serviço**: `authService` (login, logout, isAuthenticated, getAuthHeaders, getUserData, isAdmin, isCliente)
- **Proteção**: `ProtectedRoute` wrapper para rotas privadas

### 2. [PERSONALIZAR: Módulo Principal 1]
- **Campos**: [PERSONALIZAR: listar campos principais]
- **Endpoints**: GET, POST, PUT, DELETE `/api/v1/[endpoint]`
- **Paginação**: Sim (10, 25, 50, 100 registros)

### 3. [PERSONALIZAR: Módulo Principal 2]
- **Campos**: [PERSONALIZAR: listar campos principais]
- **Endpoints**: GET, POST, PUT, DELETE `/api/v1/[endpoint]`
- **Paginação**: Sim

### 4. [PERSONALIZAR: Adicionar mais módulos conforme necessário]

## Navegação

### Menu Principal (Navigation.tsx)
- **[PERSONALIZAR: Seção 1]**: [Submenus]
- **[PERSONALIZAR: Seção 2]**: [Submenus]
- **Administração** (apenas admin): [PERSONALIZAR: Módulos admin]
- **Painel [PERSONALIZAR: Tipo de usuário]** (apenas logado): [PERSONALIZAR: Funcionalidades do usuário]
- **Auth**: Login/Logout dinâmico

### Rotas
```
/ - Homepage
/login - Login
/register - Registro
/[PERSONALIZAR: rotas públicas]/* - [Descrição]
/[PERSONALIZAR: área do usuário]/* - Área do usuário (protegida)
/admin/* - Área administrativa (protegida)
```

## Padrões de Código - MANTER SEMPRE

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

## Tecnologias - FIXAS

- **Framework**: React 18 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn-ui
- **Routing**: React Router v6
- **State**: useState, useEffect (sem Redux)
- **HTTP**: Fetch API nativo
- **Auth**: JWT (localStorage)

## Dependências Padrão (package.json)

```json
{
  "dependencies": {
    "@hookform/resolvers": "^3.10.0",
    "@radix-ui/react-*": "versões mais recentes",
    "@tanstack/react-query": "^5.83.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^3.6.0",
    "lucide-react": "^0.462.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.61.1",
    "react-router-dom": "^6.30.1",
    "sonner": "^1.7.4",
    "tailwind-merge": "^2.6.0",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.25.76"
  }
}
```

## Variáveis de Ambiente

```
VITE_API_BASE_URL=[PERSONALIZAR: URL da API]
```

## Identidade Visual - PADRÃO

- **Cores**: primary, accent, secondary (Tailwind)
- **Gradientes**: `bg-gradient-to-r from-primary to-accent`
- **Cards**: `rounded-2xl border border-border shadow-lg`
- **Ícones**: lucide-react
- **Fonte**: Sistema padrão

## Informações de Contato

- **Email**: [PERSONALIZAR: email de contato]
- **Localização**: [PERSONALIZAR: cidade, estado]
- **Endpoint**: POST `/api/v1/sobre/enviar-email`

---

## Instruções Específicas para IA

1. **Sempre seguir a estrutura de pastas estabelecida**
2. **Manter os padrões de código (componentes, API calls, paginação)**
3. **Usar as mesmas tecnologias e dependências**
4. **Implementar autenticação JWT da mesma forma**
5. **Seguir o padrão visual (gradientes, cards, ícones)**
6. **Criar componentes reutilizáveis seguindo o padrão shadcn-ui**
7. **Implementar paginação em todas as listagens**
8. **Usar TypeScript com tipagem adequada**
9. **Seguir o padrão de rotas protegidas**
10. **Manter a estrutura de navegação responsiva**

## Personalização Necessária

Antes de começar, definir:
- [ ] Nome e descrição do projeto
- [ ] Módulos principais e seus campos
- [ ] Estrutura de navegação
- [ ] Rotas específicas
- [ ] Informações de contato
- [ ] URL da API
- [ ] Cores do tema (se diferentes do padrão)

## Exemplo de Uso

```
Criar um sistema de gerenciamento de biblioteca com:
- Módulo de Livros (título, autor, isbn, categoria, disponível)
- Módulo de Usuários (nome, email, telefone, tipo)
- Módulo de Empréstimos (usuário, livro, data empréstimo, data devolução)
- Área pública para consulta de livros
- Área do usuário para ver empréstimos
- Área admin para gerenciar tudo
```