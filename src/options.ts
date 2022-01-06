import broswer from 'webextension-polyfill';

// eslint-disable-next-line import/prefer-default-export
export const getOptions = async () => broswer.storage.sync.get({ copy: false });
