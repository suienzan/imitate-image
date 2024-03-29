import jsonfile from 'jsonfile';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';
import { hosts } from './hosts.js';

const json = (await readFile(new URL('../package.json', import.meta.url))).toString();

const { version, displayName, geckoId } = JSON.parse(json);

const target = process.env.NODE_ENV;

const file = fileURLToPath(new URL(`../extension/${target}/manifest.json`, import.meta.url));

const basic = {
  name: displayName,
  version,
  content_scripts: [
    {
      matches: ['*://*/*'],
      js: ['content-script.global.js'],
    },
  ],
  options_ui: {
    page: 'options.html',
  },
};

const permissions = ['clipboardWrite', 'contextMenus', 'notifications', 'storage'];

const firefox = {
  manifest_version: 2,
  permissions: permissions.concat(['<all_urls>']),
  background: {
    scripts: ['background.global.js'],
  },
  browser_specific_settings: {
    gecko: {
      id: geckoId,
    },
  },
};

const chrome = {
  manifest_version: 3,
  declarative_net_request: {
    rule_resources: [
      {
        id: 'rules',
        enabled: true,
        path: 'rules.json',
      },
    ],
  },
  permissions: permissions.concat(['declarativeNetRequest', 'declarativeNetRequestFeedback']),
  host_permissions: hosts.map(({ hostname }) => `*://${hostname}/`),
  background: {
    service_worker: 'background.global.js',
  },
};

const manifest = target === 'firefox' ? { ...basic, ...firefox } : { ...basic, ...chrome };

const sortByKey = (obj: Record<string, any>) => {
  const entries = Object.entries(obj);

  const order = [
    'name',
    'version',
    'manifest_version',
    'permissions',
    'host_permissions',
    'declarative_net_request',
    'background',
    'content_scripts',
    'options_ui',
    'browser_specific_settings',
  ];

  const sorted = entries.sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]));

  return Object.fromEntries(sorted);
};

jsonfile.writeFile(file, sortByKey(manifest), { spaces: 2 });

if (target === 'chrome') {
  const rules = hosts.map(({ hostname, referrer }, i) => ({
    id: i + 1,
    priority: 1,
    action: {
      type: 'modifyHeaders',
      requestHeaders: [{ header: 'Referer', operation: 'set', value: referrer }],
    },
    condition: {
      urlFilter: hostname,
      resourceTypes: ['main_frame', 'sub_frame', 'xmlhttprequest'],
    },
  }));

  const rulesFile = fileURLToPath(new URL('../extension/chrome/rules.json', import.meta.url));

  jsonfile.writeFile(rulesFile, rules, { spaces: 2 });
}
