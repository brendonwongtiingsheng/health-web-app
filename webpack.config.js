const { withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'healthWebApp',
  filename: 'remoteEntry.js',
  exposes: {
    './Module': './src/app/remote-entry/remote-entry.module.ts',
  },

  // ✅ 共享依赖照你项目需要
shared: {
  '@angular/core':   { singleton: true, strictVersion: true, requiredVersion: '15.2.10' },
  '@angular/common': { singleton: true, strictVersion: true, requiredVersion: '15.2.10' },
  '@angular/router': { singleton: true, strictVersion: true, requiredVersion: '15.2.10' },
  'rxjs':            { singleton: true, strictVersion: true, requiredVersion: '7.8.0' },
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
