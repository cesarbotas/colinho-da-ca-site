# Guia de Deploy e Configuração - Colinho da Cá

## Problema 1: CORS (Cross-Origin Resource Sharing)

### Sintoma
```
Requisição cross-origin bloqueada: falta cabeçalho 'Access-Control-Allow-Origin' no CORS
```

### Solução - Configurar CORS na API

**Arquivo: `Program.cs` ou `Startup.cs` (Backend .NET)**

```csharp
// Adicionar serviço CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173",           // Dev local (Vite)
            "http://localhost:3000",           // Dev local (alternativo)
            "http://localhost",                // Docker local
            "https://colinho-da-ca.vercel.app", // Produção Vercel
            "https://seu-dominio.com.br"       // Domínio customizado
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});

// Usar CORS (antes de app.UseAuthorization())
app.UseCors("AllowFrontend");
```

---

## Problema 2: URL da API em Diferentes Ambientes

### Cenário
- **Desenvolvimento**: API em `http://localhost:5000`
- **Render**: API em `https://colinho-da-ca-api.onrender.com`
- **Docker**: API em `http://localhost:5000` ou `http://api:5000`

### Solução 1: Variáveis de Ambiente (Recomendado)

#### Frontend - Criar arquivos .env

**.env.development** (já existe)
```env
VITE_API_BASE_URL=http://localhost:5000
```

**.env.production**
```env
VITE_API_BASE_URL=https://colinho-da-ca-api.onrender.com
```

**.env.docker**
```env
VITE_API_BASE_URL=http://api:5000
```

#### Atualizar src/lib/api/config.ts
```typescript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
```

#### Dockerfile - Suportar variáveis de ambiente
```dockerfile
# Build stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Aceitar variável de ambiente no build
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Build com variável customizada
```bash
docker build --build-arg VITE_API_BASE_URL=http://sua-api-url -t colinhodaca-frontend .
```

---

### Solução 2: Docker Compose (Mais Simples)

**docker-compose.yml**
```yaml
version: '3.8'

services:
  api:
    image: cesarbotas/colinhodaca-api:latest
    container_name: colinhodaca-api
    restart: unless-stopped
    ports:
      - "5000:80"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ConnectionStrings__DefaultConnection=Host=postgres;Database=colinhodaca;Username=admin;Password=admin
    networks:
      - colinhodaca-network
    depends_on:
      - postgres

  frontend:
    image: cesarbotas/colinhodaca-frontend:latest
    container_name: colinhodaca-frontend
    restart: unless-stopped
    ports:
      - "80:80"
    environment:
      - API_URL=http://api:5000
    networks:
      - colinhodaca-network
    depends_on:
      - api

  postgres:
    image: postgres:16
    container_name: colinhodaca-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: admin
      POSTGRES_DB: colinhodaca
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - colinhodaca-network

volumes:
  postgres_data:

networks:
  colinhodaca-network:
    driver: bridge
```

**Comandos:**
```bash
# Subir ambiente completo
docker compose up -d

# Ver logs
docker compose logs -f

# Parar ambiente
docker compose down

# Parar e remover volumes
docker compose down -v
```

---

### Solução 3: Nginx Proxy Reverso

**nginx.conf** (Frontend)
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Frontend
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy para API
    location /api/ {
        proxy_pass http://api:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Com essa configuração, o frontend chama `/api/*` e o Nginx redireciona para a API.

---

## Deploy em Produção

### Opção 1: Render (Atual)
- **API**: https://colinho-da-ca-api.onrender.com
- **Frontend**: Deploy estático ou Docker

### Opção 2: Docker Local/VPS
```bash
# Pull das imagens
docker pull cesarbotas/colinhodaca-api:latest
docker pull cesarbotas/colinhodaca-frontend:latest

# Rodar com docker-compose
docker compose up -d
```

### Opção 3: Kubernetes
```bash
kubectl apply -f k8s/
```

---

## Checklist de Deploy

### Backend (API)
- [ ] Configurar CORS com origens permitidas
- [ ] Configurar connection string do banco
- [ ] Configurar variáveis de ambiente
- [ ] Testar endpoints com Postman/Insomnia

### Frontend
- [ ] Configurar VITE_API_BASE_URL correto
- [ ] Build da aplicação (`npm run build`)
- [ ] Testar build localmente (`npm run preview`)
- [ ] Verificar se .env.production está correto

### Docker
- [ ] Build das imagens
- [ ] Push para Docker Hub
- [ ] Testar containers localmente
- [ ] Configurar docker-compose.yml
- [ ] Verificar networks e volumes

### Produção
- [ ] Configurar domínio (DNS)
- [ ] Configurar SSL/HTTPS (Let's Encrypt)
- [ ] Configurar backup do banco
- [ ] Configurar monitoramento
- [ ] Testar fluxo completo (login, CRUD, etc)

---

## Troubleshooting

### Erro: CORS bloqueado
- Verificar se API tem CORS configurado
- Verificar se origem está na lista de permitidas
- Verificar se API está rodando

### Erro: API não encontrada (404)
- Verificar VITE_API_BASE_URL
- Verificar se API está rodando na porta correta
- Verificar network do Docker (se usando containers)

### Erro: Não consegue fazer login
- Verificar se banco de dados está rodando
- Verificar connection string
- Verificar logs da API
- Verificar se JWT está configurado

---

## Contatos e Links

- **Repositório API**: [GitHub - API]
- **Repositório Frontend**: [GitHub - Frontend]
- **Docker Hub API**: https://hub.docker.com/r/cesarbotas/colinhodaca-api
- **Docker Hub Frontend**: https://hub.docker.com/r/cesarbotas/colinhodaca-frontend
- **Jenkins**: http://localhost:8090
- **Documentação**: Ver CONTEXT.md e CHANGELOG.md
