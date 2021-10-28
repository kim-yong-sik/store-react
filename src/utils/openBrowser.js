const openIos = (url) => {
  const encodedParam = fixedEncodeURIComponent('||' + url);
  window.location = 'sonyapp://openbrowser' + encodedParam;
};

const openAndroid = (url) => {
  window.location = 'sonyapp://openbrowser||' + url;
};

export const openBrowser = (agent, event) => {
  if (!agent.isApp) return;
  event.preventDefault();
  const { href } = event.currentTarget;
  if (!href) return;
  agent.device === 'ios' ? openIos(href) : openAndroid(href);
};

export const openWindow = (agent, url, target = '', features = '') => {
  if (!agent.isApp) {
    window.open(url, target, features);
    return;
  }
  agent.device === 'ios' ? openIos(url) : openAndroid(url);
};

function fixedEncodeURIComponent(str) {
  return encodeURIComponent(str)
    .replace(/[!'()]/g, escape)
    .replace(/\*/g, '%2A');
}
