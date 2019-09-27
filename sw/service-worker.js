importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js"
);

if (workbox) {
  console.log(`1111Yay! Workbox is loaded 🎉`);
  // workbox.routing.registerRoute(/\.js$/, new workbox.strategies.NetworkFirst());

  // 首先引入 Workbox 框架
  // importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.3.0/workbox-sw.js');

  //  precache (预缓存) 静态文件 通常项目中的 sw.js 源文件都是通过这样预留一个空数组的方式来预缓存内容列表的
  workbox.precaching.precacheAndRoute([
    // 注册成功后要立即缓存的资源列表
    "/test.css",
    "/index.js",
    {
      url: "/index.html",
      revision: "383676" //-- revision 可以通过工具插件workbox-webpack-plugin维护
    }
  ]);

  // html的缓存策略
  workbox.routing.registerRoute(
    new RegExp(".*.html"),
    new workbox.strategies.NetworkFirst()
  );

  workbox.routing.registerRoute(
    new RegExp(".*.(?:js|css)"),
    new workbox.strategies.CacheFirst()
  );

  workbox.routing.registerRoute(
    new RegExp("https://your.cdn.com/"),
    new workbox.strategies.StaleWhileRevalidate()
  );

  workbox.routing.registerRoute(
    new RegExp("https://your.img.cdn.com/"),
    new workbox.strategies.CacheFirst({
      cacheName: "example:img"
    })
  );

  // workbox.routing.registerRoute(
  //   // Cache CSS files.
  //   /\.css$/,
  //   // Use cache but update in the background.
  //   new workbox.strategies.StaleWhileRevalidate({
  //     // Use a custom cache name.
  //     cacheName: "css-cache"
  //   })
  // );

  // workbox.routing.registerRoute(
  //   // Cache image files.
  //   /\.(?:png|jpg|jpeg|svg|gif)$/,
  //   // Use the cache if it's available.
  //   new workbox.strategies.CacheFirst({
  //     // Use a custom cache name.
  //     cacheName: "image-cache",
  //     plugins: [
  //       new workbox.expiration.Plugin({
  //         // Cache only 20 images.
  //         maxEntries: 20,
  //         // Cache for a maximum of a week.
  //         maxAgeSeconds: 7 * 24 * 60 * 60
  //       })
  //     ]
  //   })
  // );
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}
