const getLOC = (code) => code.split('\n').length;

const getCounter = () =>
  chrome.storage.local.get('counter').then((data) => {
    return data.counter ?? 0;
  });

const incrementCounter = (count) => {
  getCounter().then((counter) => {
    chrome.storage.local.set({ counter: counter + count });
  });
};

const getCurrentTabId = async () => {
  const queryOptions = { active: true, currentWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab.id;
};

chrome.commands.onCommand.addListener((command) => {
  if (command === 'copy-all') {
    getCurrentTabId().then((tabId) => {
      chrome.tabs.sendMessage(tabId, { action: 'copy-all' }, (allCode) => {
        incrementCounter(getLOC(allCode));
      });
    });
  }
});

chrome.runtime.onMessage.addListener((req, info, cb) => {
  if (req.action === 'send-code') {
    incrementCounter(getLOC(req.code));
    return true;
  }
  if (req.action === 'get-count') {
    getCounter().then((counter) => {
      cb(counter);
    });
    return true;
  }
  return true;
});

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    chrome.tabs.create({
      url: chrome.runtime.getURL('views/welcome.html'),
    });
  }
});
