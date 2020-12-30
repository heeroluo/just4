import { parse, stringify, appendToURL } from '@/index';
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
const str1 = 'id=0&str=hello';
const str2 = 'id=0&str=hello&empty=';
const options = {
  allowEmpty: false
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
});

QUnit.test('append', function(assert: any) {
  const url1 = 'https://mrluo.life/';
  const url2 = 'https://mrluo.life/?author=Heero.Law';

  assert.strictEqual(
    appendToURL(url1, obj1),
    url1 + '?id=0&str=hello',
    '无参数URL'
  );

  assert.strictEqual(
    appendToURL(url2, obj1),
    url2 + '&id=0&str=hello',
    '带参数URL'
  );
});
