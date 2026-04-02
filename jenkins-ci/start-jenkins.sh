#!/bin/bash

echo "🚀 Iniciando ambiente Jenkins CI/CD - Colinho da Cá Frontend"
echo "============================================================"

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Inicie o Docker primeiro."
    exit 1
fi

# Navegar para diretório jenkins-ci
cd "$(dirname "$0")"

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker compose down

# Construir e iniciar serviços
echo "🏗️ Construindo e iniciando serviços..."
docker compose up -d --build

# Aguardar Jenkins inicializar
echo "⏳ Aguardando Jenkins inicializar..."
sleep 30

# Obter senha inicial do Jenkins
echo "🔑 Obtendo senha inicial do Jenkins..."
JENKINS_PASSWORD=$(docker exec jenkins-frontend cat /var/jenkins_home/secrets/initialAdminPassword 2>/dev/null)

echo ""
echo "✅ Ambiente iniciado com sucesso!"
echo "============================================================"
echo "🌐 Jenkins URL: http://localhost:8092"
echo "🔐 Senha inicial: $JENKINS_PASSWORD"
echo ""
echo "📋 Próximos passos:"
echo "1. Acesse http://localhost:8091"
echo "2. Use a senha inicial acima"
echo "3. Instale os plugins sugeridos"
echo "4. Crie um usuário admin"
echo "5. Configure o pipeline do projeto"
echo ""
echo "🛠️ Para parar o ambiente:"
echo "   cd jenkins-ci && docker compose down"
echo "============================================================"