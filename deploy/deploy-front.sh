#!/bin/bash
set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# === CONFIGURAÇÕES ===
VPS_HOST="191.252.222.186"
VPS_USER="cesarbotas"
FRONT_LOCAL="/Users/cesarbotas/Git/colinho-da-ca-site"
FRONT_REMOTE="/home/cesarbotas/front"
DOMAIN="colinhodaca.com.br"

RSYNC_EXCLUDE="--exclude .git --exclude node_modules --exclude .env --exclude coverage --exclude logs"

echo ""
echo -e "${CYAN}=========================================="
echo "  Colinho da Cá - Deploy Front"
echo "  VPS: ${VPS_HOST}"
echo "  Domínio: ${DOMAIN}"
echo "==========================================${NC}"
echo ""

# === Menu ===
echo "O que deseja fazer?"
echo "  1) Deploy do Front (build local + enviar + subir)"
echo "  2) Só enviar arquivos (sem rebuild)"
echo "  3) Só rebuildar no servidor"
echo "  4) Ver status do container"
echo "  5) Ver logs do Front"
echo "  6) Reiniciar container"
echo "  7) Parar container"
echo "  8) Setup SSL (primeira vez)"
echo "  9) Renovar certificado SSL"
echo "  0) Sair"
echo ""
read -p "Opção: " OPCAO

run_ssh() {
    ssh ${VPS_USER}@${VPS_HOST} "$1"
}

build_local() {
    echo -e "${YELLOW}Buildando localmente...${NC}"
    cd "${FRONT_LOCAL}"
    npm run build
    echo -e "${GREEN}Build local concluído ✅${NC}"
}

sync_front() {
    echo -e "${YELLOW}Enviando arquivos para VPS...${NC}"
    rsync -avz ${RSYNC_EXCLUDE} "${FRONT_LOCAL}/dist/" ${VPS_USER}@${VPS_HOST}:${FRONT_REMOTE}/dist/
    rsync -avz "${FRONT_LOCAL}/docker-compose.vps.yml" ${VPS_USER}@${VPS_HOST}:${FRONT_REMOTE}/
    rsync -avz "${FRONT_LOCAL}/Dockerfile.vps" ${VPS_USER}@${VPS_HOST}:${FRONT_REMOTE}/
    rsync -avz "${FRONT_LOCAL}/nginx.conf" ${VPS_USER}@${VPS_HOST}:${FRONT_REMOTE}/
    rsync -avz "${FRONT_LOCAL}/nginx-ssl.conf" ${VPS_USER}@${VPS_HOST}:${FRONT_REMOTE}/
    echo -e "${GREEN}Arquivos enviados ✅${NC}"
}

build_front() {
    echo -e "${YELLOW}Limpando containers órfãos...${NC}"
    run_ssh "cd ${FRONT_REMOTE} && docker compose -f docker-compose.vps.yml down --remove-orphans 2>/dev/null || true"
    echo -e "${YELLOW}Subindo container na VPS...${NC}"
    run_ssh "cd ${FRONT_REMOTE} && docker compose -f docker-compose.vps.yml up -d --build"
    echo -e "${GREEN}Front rodando ✅${NC}"
}

verify_front() {
    echo -e "${YELLOW}Verificando container...${NC}"
    sleep 3
    if run_ssh "docker ps --format '{{.Names}}' | grep -q colinho-front"; then
        echo -e "${GREEN}Container colinho-front rodando ✅${NC}"
        if run_ssh "curl -sf http://localhost/health > /dev/null 2>&1"; then
            echo -e "${GREEN}Health check OK ✅${NC}"
        else
            echo -e "${YELLOW}⚠️  Health check falhou (pode estar iniciando ainda)${NC}"
        fi
    else
        echo -e "${RED}Container colinho-front não está rodando ❌${NC}"
        run_ssh "docker logs colinho-front --tail 20 2>/dev/null" || true
    fi
}

case $OPCAO in
    1)
        echo -e "${CYAN}=== DEPLOY FRONT (build local) ===${NC}"
        build_local
        sync_front
        build_front
        verify_front
        echo ""
        echo -e "${GREEN}=========================================="
        echo -e "  Front deploy finalizado! 🚀"
        echo -e "==========================================${NC}"
        echo ""
        echo "  🌐 https://${DOMAIN}"
        echo ""
        ;;
    2)
        echo -e "${CYAN}=== ENVIAR ARQUIVOS ===${NC}"
        sync_front
        echo -e "${YELLOW}⚠️  Arquivos enviados mas container NÃO foi rebuildado${NC}"
        echo "  Rode opção 3 para rebuildar."
        ;;
    3)
        echo -e "${CYAN}=== REBUILD ===${NC}"
        build_front
        verify_front
        echo -e "${GREEN}Front disponível em https://${DOMAIN} ✅${NC}"
        ;;
    4)
        echo -e "${CYAN}=== STATUS ===${NC}"
        run_ssh "docker ps --filter name=colinho --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'"
        ;;
    5)
        echo -e "${CYAN}=== LOGS FRONT ===${NC}"
        run_ssh "docker logs colinho-front --tail 50"
        ;;
    6)
        echo -e "${CYAN}=== REINICIANDO ===${NC}"
        run_ssh "cd ${FRONT_REMOTE} && docker compose -f docker-compose.vps.yml restart"
        echo -e "${GREEN}Container reiniciado ✅${NC}"
        ;;
    7)
        echo -e "${CYAN}=== PARANDO ===${NC}"
        run_ssh "cd ${FRONT_REMOTE} && docker compose -f docker-compose.vps.yml down"
        echo -e "${GREEN}Container parado ✅${NC}"
        ;;
    8)
        echo -e "${CYAN}=== SETUP SSL ===${NC}"
        bash "${FRONT_LOCAL}/deploy/init-ssl.sh"
        ;;
    9)
        echo -e "${CYAN}=== RENOVAR SSL ===${NC}"
        run_ssh "docker exec colinho-certbot certbot renew"
        run_ssh "cd ${FRONT_REMOTE} && docker compose -f docker-compose.vps.yml restart front"
        echo -e "${GREEN}Certificado renovado ✅${NC}"
        ;;
    0)
        echo "Saindo..."
        exit 0
        ;;
    *)
        echo -e "${RED}Opção inválida${NC}"
        exit 1
        ;;
esac
