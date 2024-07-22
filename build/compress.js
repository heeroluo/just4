/**
 * @file 处理 TypeScript 编译后的文件压缩
 */

const fs = require('fs');
const { globSync } = require('glob');
const terser = require('terser');

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
    format: {
      'ascii_only': true
    }
  });
  await writeFile(file, result.code);
}

globSync('dist/es/**/*.js', {
  cwd: process.cwd(),
  absolute: true
}).forEach(compress);
