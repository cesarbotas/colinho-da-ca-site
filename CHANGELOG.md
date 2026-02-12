# Changelog - Colinho da Ca Site

## Alterações Realizadas

### 1. Reorganização da Estrutura de API
- **Pasta**: `src/lib/api/`
- **Estrutura**: Organização por domínio (clientes, pets, reservas, auth)
- **Arquivos**:
  - `config.ts`: Configuração base (API_BASE_URL, interface PaginatedResponse)
  - `index.ts`: Exportação centralizada de todos os módulos
  - `clientes/`: types.ts, api.ts
  - `pets/`: types.ts, api.ts, enums.ts
  - `reservas/`: types.ts, api.ts
  - `auth/`: types.ts, service.ts

### 2. Sistema de Autenticação JWT
- **Implementação**: Login com token JWT armazenado em localStorage
- **Arquivos**:
  - `src/lib/api/auth/service.ts`: authService (login, logout, getToken, isAuthenticated, getAuthHeaders)
  - `src/components/auth/ProtectedRoute.tsx`: Componente para proteger rotas
  - `src/pages/auth/Login.tsx`: Página de login
- **Fluxo**: Login → Token salvo → Rotas protegidas → Menu dinâmico
- **Logout**: Redireciona para homepage (/)

### 3. Reorganização de Páginas
- **Estrutura por domínio**:
  - `src/pages/auth/`: Login.tsx
  - `src/pages/cadastros/`: Cadastro.tsx, CadastroCliente.tsx, CadastroPets.tsx, CadastroReservas.tsx
  - `src/pages/servicos/`: Servicos.tsx, ServicoCuidados.tsx, ServicoHospedagem.tsx
  - `src/pages/sobre/`: Sobre.tsx, SobreHistoria.tsx, SobreContato.tsx

### 4. Modelo de Dados - Pets
- **Alterações**:
  - Campo `especie` → `porte` (tamanho do pet)
  - Campo `nomePet` → `nome`
  - Enum `PortePet`: P (Pequeno), M (Médio), G (Grande)
  - Adicionado `clienteId` e `clienteNome`
- **Arquivo**: `src/lib/api/pets/enums.ts` com helper `getPorteLabel()`

### 5. Sistema de Paginação
- **Implementado em**: Clientes e Pets
- **Recursos**:
  - Dropdown de tamanho de página: 10, 25, 50, 100 itens
  - Botões Anterior/Próxima
  - Exibição de "Mostrando X-Y de Z registros"
- **Padrão**: Estado com `page` e `pageSize`, parâmetros `Paginacao.NumeroPagina` e `Paginacao.QuantidadeRegistros`

### 6. Sistema de Reservas (CRUD Completo)
- **Recursos**:
  - Dropdown de seleção de cliente
  - Seleção de até 3 pets (checkboxes)
  - Date pickers para data inicial e final
  - Lista com linhas expansíveis mostrando nomes dos pets
  - Paginação completa
- **Arquivos**:
  - `src/components/ReservaForm.tsx`
  - `src/components/ReservaList.tsx`
  - `src/pages/cadastros/CadastroReservas.tsx`

### 7. Sistema de Cupons (CRUD Completo)
- **Recursos**:
  - 4 tipos de cupom: % Total, % Pet Mín, % Pet Diárias, Fixo Mín
  - Campos: código, descrição, tipo, percentual, valorFixo
  - Campos opcionais: minimoValorTotal, minimoPets, minimoDiarias, dataInicio, dataFim
  - Inativação de cupom (não permite edição quando inativo)
  - Listagem com badges de tipo e status
  - Paginação completa
- **Arquivos**:
  - `src/lib/api/cupons/`: types.ts, api.ts, index.ts
  - `src/components/CupomForm.tsx`
  - `src/components/CupomList.tsx`
  - `src/pages/admin/AdminCupons.tsx`
- **Endpoints**:
  - GET `/api/v1/cupons` - Listar (paginado)
  - POST `/api/v1/cupons` - Cadastrar
  - PUT `/api/v1/cupons/{id}` - Alterar
  - POST `/api/v1/cupons/{id}/inativar` - Inativar

### 8. Página de Contato
- **Atualizações**:
  - Email: colinhodaca@gmail.com
  - Endereço: Santos, SP
  - Campo "Assunto" adicionado
  - "Telefone" → "Celular"
  - Integração com API: `/api/v1/sobre/enviar-email`
- **Arquivo**: `src/pages/sobre/SobreContato.tsx`

### 9. Navegação Dinâmica
- **Recursos**:
  - Menu "Cadastro" visível apenas quando autenticado
  - Botão "Login" quando não autenticado
  - Botão "Logout" quando autenticado
  - Logout redireciona para homepage (/)
- **Arquivo**: `src/components/Navigation.tsx`

### 10. Rotas Protegidas
- **Implementação**: Wrapper `ProtectedRoute` em rotas de cadastro
- **Comportamento**: Redireciona para /login se não autenticado
- **Arquivo**: `src/App.tsx`

## Padrões de Código

### API Pattern
```typescript
// Todas as chamadas API incluem token JWT
const response = await fetch(`${API_BASE_URL}/endpoint`, {
  headers: getAuthHeaders(),
  // ...
});
```

### Paginação Pattern
```typescript
const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(10);
// Dropdown: 10, 25, 50, 100
// Botões: Anterior/Próxima
```

### Estrutura de Componentes CRUD
```
- Navigation component
- Container max-w-4xl
- Ícone + Título
- Toggle Lista/Formulário
- Componentes List e Form separados
```

## Endpoints da API

- **Auth**: `/api/v1/auth/login`
- **Clientes**: `/api/v1/clientes`
- **Pets**: `/api/v1/pets`
- **Reservas**: `/api/v1/reservas`
- **Cupons**: `/api/v1/cupons`
- **Contato**: `/api/v1/sobre/enviar-email`

## Tecnologias Utilizadas

- React + TypeScript
- Vite
- Tailwind CSS
- shadcn-ui
- React Router
- JWT Authentication
