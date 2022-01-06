#!/bin/bash

rm -rf dist/chrome &&
pnpm run manifest:chrome &&
mkdir -p dist/chrome &&
PACKAGE_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]') &&
crx pack extension -o dist/chrome/imitate-image-"$PACKAGE_VERSION".crx
