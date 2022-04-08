const getAllCode = (preElements) =>
  [...preElements]
    .map((preElement) => {
      return preElement.querySelector('code').innerText;
    })
    .join('');

const notify = () => {
  const scriptElement = document.createElement('script');
  scriptElement.src = chrome.runtime.getURL('execute.js');

  document.body.appendChild(scriptElement);
  scriptElement.onload = () => {
    scriptElement.remove();
  };
};

const preElements = document.querySelectorAll('pre');

[...preElements].forEach((preElement) => {
  const root = document.createElement('div');
  root.style.position = 'relative';

  const shadowRoot = root.attachShadow({ mode: 'open' });
  const cssUrl = chrome.runtime.getURL('styles/content-script.css');
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = cssUrl;
  shadowRoot.appendChild(link);

  const button = document.createElement('button');
  button.innerText = 'Copy';
  button.type = 'button';
  button.classList.add('copy-button');

  shadowRoot.prepend(button);
  preElement.prepend(root);

  const codeElement = preElement.querySelector('code');
  const code = codeElement.innerText;
  button.addEventListener('click', () => {
    navigator.clipboard.writeText(code).then(() => {
      chrome.runtime.sendMessage({ action: 'send-code', code });
      notify();
    });
  });
});

chrome.runtime.onMessage.addListener((req, info, cb) => {
  if (req.action === 'copy-all') {
    const allCode = getAllCode(preElements);

    navigator.clipboard.writeText(allCode).then(() => {
      notify();
      cb(allCode);
    });
    return true;
  }
  return true;
});
