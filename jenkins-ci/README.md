# Jenkins CI/CD - Colinho da Cá Frontend

## 🏗️ Arquitetura

```
┌─────────────────────┐
│      Jenkins        │
│  (Orquestrador CI)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Docker Agent       │
│  (Build Node.js 18) │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Docker Daemon      │
│  (Build imagens)    │
└─────────────────────┘
```

## 🚀 Iniciar Ambiente

```bash
./start-jenkins.sh
```

## 🔧 Configuração Manual

1. **Acesse Jenkins**: http://localhost:8091
2. **Senha inicial**: Será exibida no terminal
3. **Plugins necessários**:
   - Docker Pipeline
   - Git
   - Pipeline
   - NodeJS Plugin
   - Blue Ocean (opcional)

## 📋 Pipeline Stages

1. **Checkout** - Baixa código fonte
2. **Setup Node.js** - Configura ambiente Node.js 18
3. **Install Dependencies** - Instala dependências npm
4. **Lint** - Executa ESLint
5. **Build** - Compila aplicação React
6. **Test** - Executa testes (se configurados)
7. **Docker Build** - Cria imagem Docker
8. **Docker Push** - Envia para registry (apenas branch main)

## 🐳 Serviços

- **Jenkins**: http://localhost:8091
- **Jenkins Agent**: Container com Node.js 18 + Docker CLI

## 🛠️ Comandos Úteis

```bash
# Parar ambiente
cd jenkins-ci && docker compose down

# Ver logs
docker logs jenkins-frontend
docker logs jenkins-agent-frontend

# Limpar volumes
docker compose down -v

# Reconstruir agent
docker compose up -d --build jenkins-agent
```

## 📊 Métricas

- ✅ Build automatizado
- ✅ Lint automático (ESLint)
- ✅ Build otimizado (Vite)
- ✅ Imagem Docker multi-stage
- ✅ Deploy automático

## 🔧 Configuração do Pipeline

1. **Novo Item** → **Pipeline**
2. **Pipeline** → **Pipeline script from SCM**
3. **SCM**: Git
4. **Repository URL**: URL do seu repositório
5. **Script Path**: `Jenkinsfile`

## 🌐 Variáveis de Ambiente

```bash
# No Jenkins, configure:
DOCKER_HUB_CREDENTIALS=dockerhub  # ID das credenciais Docker Hub
IMAGE_NAME=cesarbotas/colinhodaca-frontend
```

## 🚀 Deploy

A pipeline automaticamente:
- Faz build da aplicação React
- Cria imagem Docker otimizada
- Faz push para Docker Hub
- Disponibiliza na porta 80 (Nginx)