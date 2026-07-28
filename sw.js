// ============================================================
// 欣子工作台 — Service Worker（离线缓存）
// ============================================================

const CACHE_NAME = 'xinzi-workbench-v2';
const CACHE_FILES = [
  './index.html',
  './css/style.css',
  './js/data.js',
  './js/app.js',
  './manifest.json'
];

// 安装：缓存核心文件
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(CACHE_FILES);
    })
  );
  self.skipWaiting();
});

// 激活：清理旧缓存
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(
        names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))
      );
    })
  );
  self.clients.claim();
});

// 拦截请求：缓存优先
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});
