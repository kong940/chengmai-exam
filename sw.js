/* 澄迈备考题库 PWA Service Worker
 * - 预缓存应用壳（离线可用，因数据已内联）
 * - 数据(data.js/data.json)：network-first，确保题库更新及时生效
 * - 静态资源：cache-first，离线兜底
 * 每次修改本文件即可触发更新（浏览器会重新安装并刷新缓存）
 */
const CACHE = 'cmaiqb-v1';
const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL).catch(() => {})).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function isData(req) {
  const p = new URL(req.url).pathname;
  return p.endsWith('data.js') || p.endsWith('data.json');
}

function networkFirst(req) {
  return fetch(req)
    .then(res => {
      if (res && res.status === 200 && res.type === 'basic') {
        caches.open(CACHE).then(c => c.put(req, res.clone()));
      }
      return res || caches.match('./index.html');
    })
    .catch(() => caches.match(req).then(r => r || caches.match('./index.html')));
}

function cacheFirst(req) {
  return caches.match(req).then(r => {
    if (r) return r;
    return fetch(req).then(res => {
      if (res && res.status === 200 && res.type === 'basic') {
        caches.open(CACHE).then(c => c.put(req, res.clone()));
      }
      return res;
    });
  });
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // 仅处理同源

  const path = url.pathname;
  if (isData(req) || req.mode === 'navigate' || path.endsWith('index.html') || SHELL.includes(path)) {
    event.respondWith(networkFirst(req));
  } else {
    event.respondWith(cacheFirst(req));
  }
});
