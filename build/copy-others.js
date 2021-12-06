/**
 * @file 拷贝非源代码文件到包的发布目录，包括：package.json、LICENSE、README.md。
 * 其中，在拷贝 package.json 的时候，会移除开发阶段使用的字段。
 */

const fs = require('fs');
const path = require('path');

const pkgDir = process.cwd();
const pkgJSON = require(path.join(pkgDir, 'package.json'));
const rootPkgJSON = require('../package');

// 复用根目录包信息
Object.keys(rootPkgJSON).forEach((key) => {
  if (pkgJSON[key] == null) {
    pkgJSON[key] = rootPkgJSON[key];
  }
});
// 移除开发阶段使用的字段
delete pkgJSON.devDependencies;
delete pkgJSON.scripts;
delete pkgJSON.private;
delete pkgJSON.devPort;
fs.writeFileSync(
  path.join(pkgDir, 'dist', 'es', 'package.json'),
  JSON.stringify(pkgJSON, null, 2),
  'utf-8'
);

[
  path.resolve(__dirname, '..', 'LICENSE'),
  path.join(pkgDir, 'README.md')
].forEach((filePath) => {
  fs.copyFileSync(
    filePath,
    path.resolve(pkgDir, 'dist', 'es', path.basename(filePath))
  );
});
