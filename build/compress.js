/**
 * @file 处理 TypeScript 编译后的文件压缩
 */

const path = require('path');
const fs = require('fs');
const glob = require('glob');
const terser = require('terser');

const pkgName = path.relative(
  path.resolve(__dirname, '../packages'),
  process.cwd()
);
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
  const result = await terser.minify(code, {
    compress: false,
    mangle: false,
    format: {
      'ascii_only': true,
      beautify: true
    }
  });
  await writeFile(file, result.code);
}

glob('dist/es/**/*.js', {
  cwd: pkgDir,
  absolute: true
}, function(err, files) {
  files = files.filter(function(file) {
    // 排除声明文件
    return !/\.d\.ts$/.test(file);
  });
  Promise.all(files.map(compress));
});
