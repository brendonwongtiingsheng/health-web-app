// 🛑 关键修改：手动引入你的 Remote Module
// 这一行代码在运行时可能什么都不做，但它会强迫 Webpack 把这个文件打包进去！
import('./app/remote-entry/remote-entry.module');

// 👇 你原有的启动代码保持不变
import('./bootstrap')
  .catch(err => console.error(err));