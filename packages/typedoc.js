/**
 * TypeDoc 通用配置逻辑。
 */

const path = require('path');
const cwd = process.cwd();

module.exports = {
  entryPoints: [path.join(cwd, 'src')],
  entryPointStrategy: 'expand',
  out: path.resolve(
    __dirname, '../docs', path.relative(__dirname, cwd)
  ),
  excludeInternal: true,
  listInvalidSymbolLinks: true
};
