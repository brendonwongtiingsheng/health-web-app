const { withModuleFederationPlugin, share } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin(
  {
    name: 'healthWebApp',
    filename: 'remoteEntry.js',
    exposes: {
      './Module': './src/app/remote-entry/remote-entry.module.ts',
    },
    shared: share({
      '@angular/core': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
      '@angular/common': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
      '@angular/common/http': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
      '@angular/router': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
      rxjs: { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    }),
  },
  (config) => {
    config.output.publicPath = 'https://health-web-app-mu.vercel.app/'; // ✅换成你现在这个新域名
    config.output.scriptType = 'module'; // 可选，但建议
    return config;
  }
);
