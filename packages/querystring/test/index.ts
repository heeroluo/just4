import 'core-js';
import { parse, stringify, concat, replace } from '@/index';


const QUnit = (<any>window).QUnit;

QUnit.start();

const obj1 = {
  id: '0',
  str: 'hello'
};
const obj2 = {
  id: '0',
  str: 'hello',
  empty: ''
};
const obj3 = {
  id: '1',
  str: 'hello1',
  error: {}
};
const str1 = 'id=0&str=hello';
const str2 = 'id=0&str=hello&empty=';
const str3 = 'id=1&str=hello1&error=';
const options = {
  ignoreEmpty: true
};


QUnit.test('parse', function(assert: any) {
  assert.deepEqual(parse(str1), obj1);
  assert.deepEqual(parse(str2), obj2, '空值处理');
});

QUnit.test('stringify', function(assert: any) {
  assert.strictEqual(stringify(obj1), str1);
  assert.strictEqual(stringify(obj2), str2, '空值处理');
  assert.strictEqual(
    stringify(obj2, options),
    str1,
    '忽略空值'
  );
  assert.strictEqual(stringify(obj3), str3, '不处理引用类型');
});

QUnit.test('concat', function(assert: any) {
  const url1 = 'https://mrluo.life/';
  const url2 = 'https://mrluo.life/?author=Heero.Law';

  assert.strictEqual(
    concat(url1, obj1),
    url1 + '?id=0&str=hello',
    '无参数URL'
  );

  assert.strictEqual(
    concat(url2, obj1),
    url2 + '&id=0&str=hello',
    '带参数URL'
  );

  assert.strictEqual(
    concat(url2 + '&', obj1),
    url2 + '&id=0&str=hello',
    '带参数URL（以 & 结尾）'
  );

  assert.strictEqual(
    concat(url2 + '#abc', obj1),
    url2 + '&id=0&str=hello#abc',
    '带参数URL（有锚点）'
  );

  assert.strictEqual(
    concat(url1 + '?'),
    url1 + '?',
    '问号结尾'
  );

  assert.strictEqual(
    concat(url1, { a: null, b: undefined }, { ignoreEmpty: true }),
    url1,
    '忽略空'
  );

  assert.strictEqual(
    concat(url2, { a: null, b: '' }, { ignoreEmpty: true }),
    url2,
    '忽略空'
  );
});

QUnit.test('replace', function(assert: any) {
  assert.strictEqual(
    replace('abc?a=1&b=2', { a: 2 }),
    'abc?a=2&b=2',
    '存在要替换的参数'
  );

  assert.strictEqual(
    replace('abc?a=1&b=2#abc', { a: 2 }),
    'abc?a=2&b=2#abc',
    '存在要替换的参数（带锚点）'
  );

  assert.strictEqual(
    replace('abc?a=1&b=2', { c: 3 }),
    'abc?a=1&b=2',
    '不存在要替换的参数'
  );
});
