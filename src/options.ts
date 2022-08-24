import {
  DEFAULT_CELL_SIZE,
  getCellSize,
  getShowWithPadding,
} from './utils';

const getInput = (id: string) => document.querySelector(`#${id}`) as HTMLInputElement;

const saveOptions = (e: Event) => {
  ['cellSize'].forEach((id, i) => {
    const input = getInput(id);

    if (input.value === '') {
      input.value = [DEFAULT_CELL_SIZE][i];
      chrome.storage.sync.remove(id);
    } else {
      chrome.storage.sync.set({
        [id]: input.value,
      });
    }

    e.preventDefault();
  });

  ['showWithPadding'].forEach((id) => {
    const input = getInput(id);

    chrome.storage.sync.set({
      [id]: input.checked,
    });

    e.preventDefault();
  });
};

const restoreOptions = () => {
  getCellSize().then((x) => {
    getInput('cellSize').value = x;
  });
  getShowWithPadding().then((x) => {
    getInput('showWithPadding').checked = x;
  });
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('form')?.addEventListener('submit', saveOptions);
