import jsonfile from 'jsonfile';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';
import { needPermissionList } from './hostname.js';

const permissions = needPermissionList.map((hostname) => `*://${hostname}/*`);

const json = (await readFile(new URL('../package.json', import.meta.url))).toString();

const { version } = JSON.parse(json);

const gechoIdJson = (await readFile(new URL('../gecko-id.json', import.meta.url))).toString();
const { id } = JSON.parse(gechoIdJson);

const file = fileURLToPath(new URL('../extension/manifest.json', import.meta.url));

const basicManifest = {
  name: 'Imitate Image',
  version,
  manifest_version: 2,
  permissions: ['storage', 'contextMenus', 'clipboardWrite', '<all_urls>'].concat(permissions),
  background: {
    page: 'background.html',
  },
  content_scripts: [
    {
      matches: ['*://*/*'],
      js: ['content-script.js'],
    },
  ],
  options_ui: {
    page: 'options.html',
  },
};

const geckoId = {
  applications: {
    gecko: {
      id,
    },
  },
};

const manifest = process.env.NODE_ENV === 'firefox' ? { ...basicManifest, ...geckoId } : basicManifest;

jsonfile.writeFile(file, manifest, (err: Error) => {
  // eslint-disable-next-line no-console
  if (err) console.error(err);
});
