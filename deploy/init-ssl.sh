#!/bin/bash
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

VPS_HOST="191.252.222.186"
VPS_USER="cesarbotas"
FRONT_REMOTE="/home/cesarbotas/front"
FRONT_LOCAL="/Users/cesarbotas/Git/colinho-da-ca-site"
DOMAIN="colinhodaca.com.br"
EMAIL="cesarbotas@gmail.com"

echo -e "${CYAN}=== SETUP SSL - ${DOMAIN} ===${NC}"

run_ssh() {
    ssh ${VPS_USER}@${VPS_HOST} "$1"
}

# Step 1: Subir front com nginx HTTP (sem SSL)
echo -e "${YELLOW}1. Subindo nginx em modo HTTP...${NC}"
run_ssh "cd ${FRONT_REMOTE} && docker compose -f docker-compose.vps.yml up -d front"

# Step 2: Gerar certificado
echo -e "${YELLOW}2. Gerando certificado SSL...${NC}"
run_ssh "docker run --rm \
    -v front_certbot-conf:/etc/letsencrypt \
    -v front_certbot-www:/var/www/certbot \
    certbot/certbot certonly \
    --webroot -w /var/www/certbot \
    -d ${DOMAIN} -d www.${DOMAIN} \
    --email ${EMAIL} \
    --agree-tos --no-eff-email"

# Step 3: Trocar nginx.conf para versão SSL
echo -e "${YELLOW}3. Ativando SSL no nginx...${NC}"
rsync -avz "${FRONT_LOCAL}/nginx-ssl.conf" ${VPS_USER}@${VPS_HOST}:${FRONT_REMOTE}/nginx-ssl.conf
run_ssh "cp ${FRONT_REMOTE}/nginx-ssl.conf ${FRONT_REMOTE}/nginx.conf"
run_ssh "cd ${FRONT_REMOTE} && docker compose -f docker-compose.vps.yml up -d --build"

echo ""
echo -e "${GREEN}==========================================${NC}"
echo -e "${GREEN}  SSL configurado com sucesso! 🔒${NC}"
echo -e "${GREEN}==========================================${NC}"
echo ""
echo "  🌐 https://${DOMAIN}"
echo "  🌐 https://www.${DOMAIN}"
echo ""
