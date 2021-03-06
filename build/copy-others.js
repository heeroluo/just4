/**
 * @file 拷贝非源代码文件到包的发布目录，包括：package.json、LICENSE、README.md。
 */

const fs = require('fs');
const path = require('path');

const pkgName = process.argv[2];
const pkgDir = path.resolve(__dirname, '..', 'packages', pkgName);
const rootPkgJSON = require('../package');
const pkgJSON = require(path.join(pkgDir, 'package.json'));

// 复用根目录包信息
Object.keys(rootPkgJSON).forEach((key) => {
  if (pkgJSON[key] == null) {
    pkgJSON[key] = rootPkgJSON[key];
  }
});
delete pkgJSON.devDependencies;
delete pkgJSON.scripts;
delete pkgJSON.private;
fs.writeFileSync(
  path.join(pkgDir, 'dist', 'package.json'),
  JSON.stringify(pkgJSON, null, 2),
  'utf-8'
);

[
  path.resolve(__dirname, '..', 'LICENSE'),
  path.join(pkgDir, 'README.md')
].forEach((filePath) => {
  fs.copyFileSync(
    filePath,
    path.resolve(pkgDir, 'dist', path.basename(filePath))
  );
});
