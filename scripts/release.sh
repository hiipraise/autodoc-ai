#!/usr/bin/env bash
set -e

PUMPKIN='\033[38;2;254;127;45m'
RESET='\033[0m'

if [ -z "$1" ]; then
  echo "Usage: ./scripts/release.sh <version>"
  echo "Example: ./scripts/release.sh 1.1.0"
  exit 1
fi

VERSION=$1
echo -e "${PUMPKIN}🚀 Releasing AutoDoc.ai v${VERSION}${RESET}"

# Bump versions
npm version "$VERSION" --no-git-tag-version
npm -w packages/cli version "$VERSION" --no-git-tag-version
npm -w packages/frontend version "$VERSION" --no-git-tag-version
npm -w server version "$VERSION" --no-git-tag-version

# Build
bash scripts/build.sh

# Commit and tag
git add -A
git commit -m "chore: release v${VERSION}"
git tag "v${VERSION}"

echo -e "\n${PUMPKIN}✅ Tagged v${VERSION} — run 'git push && git push --tags' to publish${RESET}"