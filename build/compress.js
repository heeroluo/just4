/**
 * @file 处理 TypeScript 编译后的文件压缩
 */

const path = require('path');
const fs = require('fs');
const glob = require('glob');
const terser = require('terser');

const pkgName = process.argv[2];
const pkgDir = path.resolve(__dirname, '..', 'packages', pkgName);

function readFile(file) {
  return new Promise(function(resolve, reject) {
    fs.readFile(file, 'utf-8', function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function writeFile(file, content) {
  return new Promise(function(resolve, reject) {
    fs.writeFile(file, content, 'utf-8', function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function compress(file) {
  const code = await readFile(file);
  const result = await terser.minify(code);
  await writeFile(file, result.code);
}

glob('dist/**/*.js', {
  cwd: pkgDir,
  absolute: true
}, function(err, files) {
  Promise.all(files.map(compress));
});
