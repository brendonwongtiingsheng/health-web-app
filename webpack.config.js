const { withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'healthWebApp',
  filename: 'remoteEntry.js',
  exposes: {
    './Module': './src/app/remote-entry/remote-entry.module.ts',
  },

  // ✅ 共享依赖照你项目需要
  shared: {
    '@angular/core': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
    '@angular/common': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
    '@angular/router': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
    rxjs: { singleton: true, strictVersion: false, requiredVersion: 'auto' },
  },
},
/** extra webpack config (非常重要) **/
{
  output: {
    publicPath: 'auto',        // ✅ 让 remote 自己决定从哪里加载 chunk（Vercel 必备）
    uniqueName: 'healthWebApp'
  },
  experiments: {
    outputModule: true         // ✅ type: 'module' 必须
  }
});
