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
    // ✅ 关键：不要 auto，用明确的 remote 域名
    config.output.publicPath = 'https://health-web-app-7r4x.vercel.app/';

    // 可选：更明确告诉 webpack 这是 module script（有些环境更稳）
    config.output.scriptType = 'module';

    return config;
  }
);
