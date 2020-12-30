import { isFunction, isDate, isObject } from '@/type';
const QUnit = (<any>window).QUnit;


QUnit.start();

QUnit.test('isFunction', (assert: any) => {
  assert.strictEqual(isFunction(() => { alert('a'); }), true);
  assert.strictEqual(isFunction(null), false);
});

QUnit.test('isDate', (assert: any) => {
  assert.strictEqual(isDate(new Date), true);
  assert.strictEqual(isDate({}), false);
});

QUnit.test('isObject', (assert: any) => {
  assert.strictEqual(isObject({}), true);
  assert.strictEqual(isObject(new Date), false);
});
