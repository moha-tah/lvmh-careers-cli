const { defaultResolver } = require('jest-resolve');
const { existsSync } = require('fs');
const { join, dirname } = require('path');

module.exports = (request, options) => {
  // Try to resolve .js imports to .ts files
  if (request.endsWith('.js')) {
    const tsPath = request.replace(/\.js$/, '.ts');
    const dir = dirname(options.basedir);
    const possiblePath = join(dir, tsPath.replace(/^\.\.?\//, ''));

    if (existsSync(possiblePath)) {
      return defaultResolver(tsPath, options);
    }
  }

  return defaultResolver(request, options);
};
