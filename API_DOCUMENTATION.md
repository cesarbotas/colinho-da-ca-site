# API Documentation - Colinho da Ca

## Base URL
```
http://localhost:5000/api/v1
```

## Autenticação

### 1. Login
**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "email": "usuario@example.com",
  "senha": "senha123"
}
```

**Response Success (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nome": "Nome do Usuário",
    "email": "usuario@example.com",
    "role": "Admin"
  }
}
```

**Response Error (401):**
```json
{
  "message": "Email ou senha inválidos"
}
```

### 2. Registro
**Endpoint:** `POST /auth/register`

**Request:**
```json
{
  "nome": "Nome Completo",
  "email": "usuario@example.com",
  "senha": "senha123",
  "celular": "(13) 99999-9999",
  "cpf": "123.456.789-00"
}
```

**Response Success (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 2,
    "nome": "Nome Completo",
    "email": "usuario@example.com",
    "role": "Cliente"
  }
}
```

### Headers para Requisições Autenticadas
```
Authorization: Bearer {token}
Content-Type: application/json
```

---

## Clientes

### 1. Listar Clientes (Paginado)
**Endpoint:** `GET /clientes?Paginacao.NumeroPagina={page}&Paginacao.QuantidadeRegistros={pageSize}`

**Headers:** Authorization required

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "nome": "João Silva",
      "email": "joao@example.com",
      "celular": "(13) 99999-9999",
      "cpf": "123.456.789-00",
      "endereco": "Rua Exemplo, 123",
      "observacoes": "Cliente VIP"
    }
  ],
  "total": 50,
  "page": 1,
  "pageSize": 10
}
```

### 2. Buscar Cliente por ID
**Endpoint:** `GET /clientes/{id}`

**Headers:** Authorization required

**Response (200):**
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@example.com",
  "celular": "(13) 99999-9999",
  "cpf": "123.456.789-00",
  "endereco": "Rua Exemplo, 123",
  "observacoes": "Cliente VIP"
}
```

### 3. Cadastrar Cliente
**Endpoint:** `POST /clientes`

**Headers:** Authorization required

**Request:**
```json
{
  "nome": "Maria Santos",
  "email": "maria@example.com",
  "celular": "(13) 98888-8888",
  "cpf": "987.654.321-00",
  "endereco": "Av. Principal, 456",
  "observacoes": "Prefere horário da manhã"
}
```

**Response (201):**
```json
{
  "id": 2,
  "nome": "Maria Santos",
  "email": "maria@example.com",
  "celular": "(13) 98888-8888",
  "cpf": "987.654.321-00",
  "endereco": "Av. Principal, 456",
  "observacoes": "Prefere horário da manhã"
}
```

### 4. Atualizar Cliente
**Endpoint:** `PUT /clientes/{id}`

**Headers:** Authorization required

**Request:**
```json
{
  "nome": "Maria Santos Silva",
  "email": "maria@example.com",
  "celular": "(13) 98888-8888",
  "cpf": "987.654.321-00",
  "endereco": "Av. Principal, 456 - Apto 10",
  "observacoes": "Prefere horário da manhã"
}
```

**Response (200):**
```json
{
  "id": 2,
  "nome": "Maria Santos Silva",
  "email": "maria@example.com",
  "celular": "(13) 98888-8888",
  "cpf": "987.654.321-00",
  "endereco": "Av. Principal, 456 - Apto 10",
  "observacoes": "Prefere horário da manhã"
}
```

### 5. Excluir Cliente
**Endpoint:** `DELETE /clientes/{id}`

**Headers:** Authorization required

**Response (204):** No content

---

## Pets

### 1. Listar Pets (Paginado)
**Endpoint:** `GET /pets?Paginacao.NumeroPagina={page}&Paginacao.QuantidadeRegistros={pageSize}&ClienteId={clienteId}`

**Headers:** Authorization required

**Query Parameters:**
- `ClienteId` (opcional): Filtrar por cliente

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "nome": "Rex",
      "porte": "G",
      "racaId": 5,
      "racaNome": "Labrador",
      "clienteId": 1,
      "clienteNome": "João Silva",
      "observacoes": "Muito dócil"
    }
  ],
  "total": 25,
  "page": 1,
  "pageSize": 10
}
```

### 2. Buscar Pet por ID
**Endpoint:** `GET /pets/{id}`

**Headers:** Authorization required

**Response (200):**
```json
{
  "id": 1,
  "nome": "Rex",
  "porte": "G",
  "racaId": 5,
  "racaNome": "Labrador",
  "clienteId": 1,
  "clienteNome": "João Silva",
  "observacoes": "Muito dócil"
}
```

### 3. Cadastrar Pet
**Endpoint:** `POST /pets`

**Headers:** Authorization required

**Request:**
```json
{
  "nome": "Bella",
  "porte": "M",
  "racaId": 3,
  "clienteId": 1,
  "observacoes": "Alérgica a frango"
}
```

**Response (201):**
```json
{
  "id": 2,
  "nome": "Bella",
  "porte": "M",
  "racaId": 3,
  "racaNome": "Poodle",
  "clienteId": 1,
  "clienteNome": "João Silva",
  "observacoes": "Alérgica a frango"
}
```

### 4. Atualizar Pet
**Endpoint:** `PUT /pets/{id}`

**Headers:** Authorization required

**Request:**
```json
{
  "nome": "Bella",
  "porte": "M",
  "racaId": 3,
  "clienteId": 1,
  "observacoes": "Alérgica a frango e milho"
}
```

**Response (200):**
```json
{
  "id": 2,
  "nome": "Bella",
  "porte": "M",
  "racaId": 3,
  "racaNome": "Poodle",
  "clienteId": 1,
  "clienteNome": "João Silva",
  "observacoes": "Alérgica a frango e milho"
}
```

### 5. Excluir Pet
**Endpoint:** `DELETE /pets/{id}`

**Headers:** Authorization required

**Response (204):** No content

---

## Raças

### 1. Listar Raças
**Endpoint:** `GET /racas`

**Headers:** Authorization required

**Response (200):**
```json
[
  {
    "id": 1,
    "nome": "Vira-lata"
  },
  {
    "id": 2,
    "nome": "Golden Retriever"
  },
  {
    "id": 3,
    "nome": "Poodle"
  }
]
```

---

## Reservas

### 1. Listar Reservas (Paginado)
**Endpoint:** `GET /reservas?Paginacao.NumeroPagina={page}&Paginacao.QuantidadeRegistros={pageSize}&ClienteId={clienteId}`

**Headers:** Authorization required

**Query Parameters:**
- `ClienteId` (opcional): Filtrar por cliente

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "clienteId": 1,
      "clienteNome": "João Silva",
      "dataInicial": "2024-01-15T00:00:00",
      "dataFinal": "2024-01-20T00:00:00",
      "quantidadeDiarias": 5,
      "quantidadePets": 2,
      "valorTotal": 850.00,
      "valorDesconto": 50.00,
      "observacoes": "Primeira hospedagem",
      "status": 1,
      "statusTimeline": {
        "1": true,
        "2": false,
        "3": false,
        "4": false,
        "5": false
      },
      "pets": [
        {
          "id": 1,
          "nome": "Rex"
        },
        {
          "id": 2,
          "nome": "Bella"
        }
      ]
    }
  ],
  "total": 30,
  "page": 1,
  "pageSize": 10
}
```

### 2. Buscar Reserva por ID
**Endpoint:** `GET /reservas/{id}`

**Headers:** Authorization required

**Response (200):**
```json
{
  "id": 1,
  "clienteId": 1,
  "clienteNome": "João Silva",
  "dataInicial": "2024-01-15T00:00:00",
  "dataFinal": "2024-01-20T00:00:00",
  "quantidadeDiarias": 5,
  "quantidadePets": 2,
  "valorTotal": 850.00,
  "valorDesconto": 50.00,
  "observacoes": "Primeira hospedagem",
  "status": 1,
  "statusTimeline": {
    "1": true,
    "2": false,
    "3": false,
    "4": false,
    "5": false
  },
  "pets": [
    {
      "id": 1,
      "nome": "Rex",
      "valorDiaria": 85.00
    },
    {
      "id": 2,
      "nome": "Bella",
      "valorDiaria": 85.00
    }
  ]
}
```

### 3. Cadastrar Reserva
**Endpoint:** `POST /reservas`

**Headers:** Authorization required

**Request:**
```json
{
  "clienteId": 1,
  "petIds": [1, 2],
  "dataInicial": "2024-01-15",
  "dataFinal": "2024-01-20",
  "quantidadeDiarias": 5,
  "quantidadePets": 2,
  "valorTotal": 850.00,
  "observacoes": "Primeira hospedagem"
}
```

**Response (201):**
```json
{
  "id": 1,
  "clienteId": 1,
  "clienteNome": "João Silva",
  "dataInicial": "2024-01-15T00:00:00",
  "dataFinal": "2024-01-20T00:00:00",
  "quantidadeDiarias": 5,
  "quantidadePets": 2,
  "valorTotal": 850.00,
  "valorDesconto": 0,
  "observacoes": "Primeira hospedagem",
  "status": 1,
  "pets": [
    {
      "id": 1,
      "nome": "Rex"
    },
    {
      "id": 2,
      "nome": "Bella"
    }
  ]
}
```

### 4. Atualizar Reserva
**Endpoint:** `PUT /reservas/{id}`

**Headers:** Authorization required

**Request:**
```json
{
  "clienteId": 1,
  "petIds": [1, 2],
  "dataInicial": "2024-01-15",
  "dataFinal": "2024-01-22",
  "quantidadeDiarias": 7,
  "quantidadePets": 2,
  "valorTotal": 1190.00,
  "observacoes": "Estendida por mais 2 dias"
}
```

**Response (200):**
```json
{
  "id": 1,
  "clienteId": 1,
  "clienteNome": "João Silva",
  "dataInicial": "2024-01-15T00:00:00",
  "dataFinal": "2024-01-22T00:00:00",
  "quantidadeDiarias": 7,
  "quantidadePets": 2,
  "valorTotal": 1190.00,
  "valorDesconto": 0,
  "observacoes": "Estendida por mais 2 dias",
  "status": 1
}
```

### 5. Excluir Reserva
**Endpoint:** `DELETE /reservas/{id}`

**Headers:** Authorization required

**Response (204):** No content

### 6. Confirmar Reserva
**Endpoint:** `POST /reservas/{id}/confirmar`

**Headers:** Authorization required

**Response (200):**
```json
{
  "message": "Reserva confirmada com sucesso",
  "status": 2
}
```

### 7. Aprovar Pagamento
**Endpoint:** `POST /reservas/{id}/aprovar-pagamento`

**Headers:** Authorization required

**Response (200):**
```json
{
  "message": "Pagamento aprovado com sucesso",
  "status": 4
}
```

### 8. Cancelar Reserva
**Endpoint:** `POST /reservas/{id}/cancelar`

**Headers:** Authorization required

**Response (200):**
```json
{
  "message": "Reserva cancelada com sucesso",
  "status": 6
}
```

### 9. Aplicar Desconto
**Endpoint:** `POST /reservas/{id}/desconto`

**Headers:** Authorization required (Admin only)

**Request:**
```json
{
  "valorDesconto": 50.00
}
```

**Response (200):**
```json
{
  "message": "Desconto aplicado com sucesso",
  "valorDesconto": 50.00,
  "valorTotal": 850.00,
  "valorFinal": 800.00
}
```

### 10. Enviar Comprovante de Pagamento
**Endpoint:** `POST /reservas/{id}/comprovante`

**Headers:** Authorization required

**Request:**
```json
{
  "comprovantePagamento": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "observacoesPagamento": "Pagamento via PIX"
}
```

**Response (200):**
```json
{
  "message": "Comprovante enviado com sucesso",
  "status": 3
}
```

### 11. Buscar Comprovante de Pagamento
**Endpoint:** `GET /reservas/{id}/comprovante`

**Headers:** Authorization required

**Response (200):**
```json
{
  "comprovantePagamento": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "observacoesPagamento": "Pagamento via PIX",
  "dataPagamento": "2024-01-14T10:30:00"
}
```

---

## Cupons

### 1. Listar Cupons (Paginado)
**Endpoint:** `GET /cupons?Paginacao.NumeroPagina={page}&Paginacao.QuantidadeRegistros={pageSize}`

**Headers:** Authorization required (Admin only)

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "codigo": "PRIMEIRAHOSP",
      "descricao": "Desconto primeira hospedagem",
      "tipo": 1,
      "percentual": 10.0,
      "valorFixo": null,
      "minimoValorTotal": 500.00,
      "minimoPets": 1,
      "minimoDiarias": 3,
      "dataInicio": "2024-01-01T00:00:00",
      "dataFim": "2024-12-31T23:59:59",
      "ativo": true
    }
  ],
  "total": 15,
  "page": 1,
  "pageSize": 10
}
```

### 2. Buscar Cupom por ID
**Endpoint:** `GET /cupons/{id}`

**Headers:** Authorization required (Admin only)

**Response (200):**
```json
{
  "id": 1,
  "codigo": "PRIMEIRAHOSP",
  "descricao": "Desconto primeira hospedagem",
  "tipo": 1,
  "percentual": 10.0,
  "valorFixo": null,
  "minimoValorTotal": 500.00,
  "minimoPets": 1,
  "minimoDiarias": 3,
  "dataInicio": "2024-01-01T00:00:00",
  "dataFim": "2024-12-31T23:59:59",
  "ativo": true
}
```

### 3. Cadastrar Cupom
**Endpoint:** `POST /cupons`

**Headers:** Authorization required (Admin only)

**Request (Tipo 1 - Percentual sobre total):**
```json
{
  "codigo": "VERAO2024",
  "descricao": "Desconto de verão",
  "tipo": 1,
  "percentual": 15.0,
  "minimoValorTotal": 300.00,
  "dataInicio": "2024-01-01T00:00:00",
  "dataFim": "2024-03-31T23:59:59"
}
```

**Request (Tipo 4 - Valor fixo):**
```json
{
  "codigo": "FIXO50",
  "descricao": "R$ 50 de desconto",
  "tipo": 4,
  "valorFixo": 50.00,
  "minimoValorTotal": 500.00,
  "dataInicio": "2024-01-01T00:00:00",
  "dataFim": "2024-12-31T23:59:59"
}
```

**Response (201):**
```json
{
  "id": 2,
  "codigo": "VERAO2024",
  "descricao": "Desconto de verão",
  "tipo": 1,
  "percentual": 15.0,
  "valorFixo": null,
  "minimoValorTotal": 300.00,
  "minimoPets": null,
  "minimoDiarias": null,
  "dataInicio": "2024-01-01T00:00:00",
  "dataFim": "2024-03-31T23:59:59",
  "ativo": true
}
```

### 4. Atualizar Cupom
**Endpoint:** `PUT /cupons/{id}`

**Headers:** Authorization required (Admin only)

**Request:**
```json
{
  "codigo": "VERAO2024",
  "descricao": "Desconto de verão - Atualizado",
  "tipo": 1,
  "percentual": 20.0,
  "minimoValorTotal": 300.00,
  "dataInicio": "2024-01-01T00:00:00",
  "dataFim": "2024-03-31T23:59:59"
}
```

**Response (200):**
```json
{
  "id": 2,
  "codigo": "VERAO2024",
  "descricao": "Desconto de verão - Atualizado",
  "tipo": 1,
  "percentual": 20.0,
  "valorFixo": null,
  "minimoValorTotal": 300.00,
  "minimoPets": null,
  "minimoDiarias": null,
  "dataInicio": "2024-01-01T00:00:00",
  "dataFim": "2024-03-31T23:59:59",
  "ativo": true
}
```

### 5. Inativar Cupom
**Endpoint:** `POST /cupons/{id}/inativar`

**Headers:** Authorization required (Admin only)

**Response (200):**
```json
{
  "message": "Cupom inativado com sucesso",
  "ativo": false
}
```

---

## Contato

### 1. Enviar Email de Contato
**Endpoint:** `POST /sobre/enviar-email`

**Request:**
```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "mensagem": "Gostaria de mais informações sobre os serviços"
}
```

**Response (200):**
```json
{
  "message": "Email enviado com sucesso"
}
```

---

## Status Codes

- **200 OK**: Requisição bem-sucedida
- **201 Created**: Recurso criado com sucesso
- **204 No Content**: Requisição bem-sucedida sem conteúdo de retorno
- **400 Bad Request**: Dados inválidos
- **401 Unauthorized**: Não autenticado
- **403 Forbidden**: Sem permissão
- **404 Not Found**: Recurso não encontrado
- **500 Internal Server Error**: Erro no servidor

---

## Tipos de Dados

### Porte de Pet
- `P`: Pequeno
- `M`: Médio
- `G`: Grande

### Tipo de Cupom
- `1`: Percentual sobre total
- `2`: Percentual por pet com mínimo
- `3`: Percentual por pet com diárias
- `4`: Valor fixo com mínimo

### Status de Reserva
- `1`: Criada
- `2`: Confirmada
- `3`: Pagamento Pendente
- `4`: Pagamento Aprovado
- `5`: Finalizada
- `6`: Cancelada

### Roles de Usuário
- `Admin`: Acesso total ao sistema
- `Cliente`: Acesso ao painel do cliente
