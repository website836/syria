const CACHE_NAME = 'estijaba-v1';
const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json',
  'https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.22.1/firebase-database-compat.js'
];

// تثبيت ملف الخدمة وتخزين الملفات محلياً
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// تفعيل وتحديث التخزين
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// استرجاع الصفحات من الهاتف عند غياب النت (Cache-First)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).catch(() => {
        // إذا انقطع النت وطلب رابطاً غير مخزن يعود للصفحة الرئيسية المخزنة
        return caches.match('./index.html');
      });
    })
  );
});