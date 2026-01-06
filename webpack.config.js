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
    config.module ||= {};
    config.module.rules ||= {};

    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg|webp)$/i,
      type: 'asset/resource',
    });

    // 添加CORS支持
    config.devServer = {
      ...config.devServer,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
      }
    };

    return config;
  }
);
