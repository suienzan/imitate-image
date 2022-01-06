#!/bin/bash

rm -rf dist/firefox-unsigned &&
pnpm run manifest:firefox &&
mkdir -p dist/firefox-unsigned &&
PACKAGE_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]') &&
web-ext build -c web-ext-config.cjs -s extension -a dist/firefox-unsigned -n imitate-image-"$PACKAGE_VERSION"-fx-unsigned.xpi
