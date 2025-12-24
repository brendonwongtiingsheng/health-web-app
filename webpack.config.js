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
    // ✅ 关键：强制 classic script container（不要 import.meta）
    config.output ||= {};
    config.output.library = { type: 'var', name: 'healthWebApp' };
    config.output.scriptType = 'text/javascript';

    // ✅ 关键：确保不是 ESM output
    config.experiments ||= {};
    config.experiments.outputModule = false;
    config.output.module = false;

    // 你的 asset rule 保留
    config.module ||= {};
    config.module.rules ||= [];
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg|webp)$/i,
      type: 'asset/resource',
    });

    return config;
  }
);
