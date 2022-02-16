#!/bin/bash

rm -rf dist/chrome
mkdir -p dist/chrome
pnpm run build:chrome
PACKAGE_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]') &&
crx pack extension/chrome -o dist/chrome/imitate-image-"$PACKAGE_VERSION".crx -p key.pem
