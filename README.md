# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/6f5225cf-e28b-4a09-9341-d79681e51a9a

## Sistema de Gerenciamento de Hospedagem de Pets - Colinho da Ca

Sistema web completo para gerenciamento de hospedagem de pets com área administrativa e painel do cliente.

### Funcionalidades Principais

#### Módulo de Reservas
- **Criação e edição** de reservas com seleção de cliente e até 3 pets
- **Timeline de status** visual com 6 estados:
  - Status 1: Criada
  - Status 2: Confirmada
  - Status 3: Pagamento Pendente
  - Status 4: Pagamento Aprovado
  - Status 5: Finalizada
  - Status 6: Cancelada (exibida em vermelho)
- **Sistema de desconto**: Admin pode conceder desconto no status "Criada"
- **Cancelamento**: Disponível nos status "Criada" e "Pagamento Pendente"
- **Resumo financeiro**: Exibe subtotal, desconto e valor final
- **Comprovante de pagamento**: Upload e visualização
- **Restrições**: Reservas finalizadas ou canceladas não podem ser editadas/excluídas

#### Gestão de Clientes
- Cadastro completo com CPF, endereço e observações
- Listagem paginada (10, 25, 50, 100 registros)
- Edição e exclusão

#### Gestão de Pets
- Cadastro com nome, porte (P/M/G), raça e observações
- Vinculação com cliente
- Listagem paginada

#### Gestão de Cupons
- 4 tipos de cupons: percentual, por pet, por diárias, valor fixo
- Regras de validade e mínimos
- Inativação de cupons

#### Autenticação
- Sistema JWT com roles (Admin/Cliente)
- Rotas protegidas
- Painel diferenciado por perfil

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/6f5225cf-e28b-4a09-9341-d79681e51a9a) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- React Router v6
- JWT Authentication

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/6f5225cf-e28b-4a09-9341-d79681e51a9a) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
