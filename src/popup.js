const render = ({ count }) => {
  const title = document.querySelector('h1');
  title.innerText = `LOC: ${count}`;
};

chrome.runtime.sendMessage({ action: 'get-count' }, (count) => {
  render({ count });
});

chrome.storage.onChanged.addListener(({ counter }) => {
  if (counter) {
    render({ count: counter.newValue });
  }
});
