const { withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

// 1. 先创建基础配置
const config = withModuleFederationPlugin({
  name: 'healthWebApp', // ✅ 确保是驼峰命名
  filename: 'remoteEntry.js',
  exposes: {
    './Module': './src/app/remote-entry/remote-entry.module.ts',
  },
  shared: {
    '@angular/core': { singleton: true, strictVersion: true, requiredVersion: '15.2.10' },
    '@angular/common': { singleton: true, strictVersion: true, requiredVersion: '15.2.10' },
    '@angular/router': { singleton: true, strictVersion: true, requiredVersion: '15.2.10' },
    'rxjs': { singleton: true, strictVersion: true, requiredVersion: '7.8.2' },
  },
});

// 2. 手动合并额外的 Webpack 配置 (这就不会被忽略了)
// 注意：如果你用的是 Webpack 5+ 和 Angular 13+，这些是必须的
config.output = {
  ...config.output,
  publicPath: 'auto',
  uniqueName: 'healthWebApp',
  scriptType: 'text/javascript' // 有时候为了兼容性需要显式声明
};

config.experiments = {
  ...config.experiments,
  outputModule: true, // ✅ 这行非常关键，之前可能因为参数没传进去导致没生效
};

// 3. 导出最终配置
module.exports = config;