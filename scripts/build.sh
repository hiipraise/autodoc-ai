#!/usr/bin/env bash
set -e

PUMPKIN='\033[38;2;254;127;45m'
RESET='\033[0m'

echo -e "${PUMPKIN}🔨 AutoDoc.ai — Full Build${RESET}\n"

echo -e "${PUMPKIN}[1/3] Building CLI...${RESET}"
npm -w packages/cli run build

echo -e "${PUMPKIN}[2/3] Building Frontend...${RESET}"
npm -w packages/frontend run build

echo -e "${PUMPKIN}[3/3] Building Server...${RESET}"
npm -w server run build

echo -e "\n${PUMPKIN}✅ All packages built successfully!${RESET}"