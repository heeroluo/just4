/**
 * @file 在 node_modules 中创建软链指向对应包的 dist 目录。
 */

const path = require('path');
const fs = require('fs');

const libPath = path.resolve(__dirname, '..', 'node_modules', '@just4');
if (!fs.existsSync(libPath)) {
  fs.mkdirSync(libPath);
}

const pkgName = process.argv[2];
if (pkgName) {
  const pkgDist = path.resolve(__dirname, '..', 'packages', pkgName, 'dist');
  if (fs.existsSync(pkgDist)) {
    fs.symlinkSync(pkgDist, path.join(libPath, pkgName));
  } else {
    console.error(`"${pkgDist}" does not exist`);
  }
}
