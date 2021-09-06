import { hasOwnProp, assignProps, isEmpty } from '@/index';
const QUnit = (<any>window).QUnit;


QUnit.start();

QUnit.test('hasOwnProp', (assert: any) => {
  assert.strictEqual(hasOwnProp({ a: false }, 'a'), true);
  assert.strictEqual(hasOwnProp([], 'prototype'), false);
});

QUnit.test('isEmpty', (assert: any) => {
  [
    undefined,
    null,
    {},
    [],
    0
  ].forEach((item) => {
    assert.strictEqual(isEmpty(item), true);
  });

  const date: Date = new Date();
  (<any>date).someProp = 1;
  [
    { a: 1 },
    [1, 2],
    date
  ].forEach((item) => {
    assert.strictEqual(isEmpty(item), false);
  });
});

QUnit.test('assignProps', (assert: any) => {
  assert.deepEqual(
    assignProps(
      { a: 1, b: 2 },
      { b: 3, c: 4 },
      { b: 5, d: 6 }
    ),
    {
      a: 1,
      b: 5,
      c: 4,
      d: 6
    }
  );
});
