#!/usr/bin/env bash
set -e

PUMPKIN='\033[38;2;254;127;45m'
RESET='\033[0m'

echo -e "${PUMPKIN}🚀 Starting AutoDoc.ai in development mode...${RESET}"
echo -e "   Frontend → http://localhost:3000"
echo -e "   API      → http://localhost:4000\n"

# Start all services in parallel
npx concurrently \
  --names "CLI,Frontend,Server" \
  --prefix-colors "yellow,cyan,green" \
  "npm -w packages/cli run dev" \
  "npm -w packages/frontend run dev" \
  "npm -w server run dev"