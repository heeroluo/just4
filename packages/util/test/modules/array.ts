import { toArray, mergeArray } from '@/array';
const QUnit = (<any>window).QUnit;


QUnit.start();

QUnit.test('toArray', (assert: any) => {
  const bodyList = document.getElementsByTagName('body');
  const bodyArr = toArray(bodyList);
  assert.strictEqual(Array.isArray(bodyArr), true);
  assert.strictEqual(bodyArr.length, bodyList.length);
  assert.strictEqual(bodyArr[0], bodyList[0]);
});

QUnit.test('mergeArray', (assert: any) => {
  assert.deepEqual(
    mergeArray([1, 2, 3], [7, 9, 10]),
    [1, 2, 3, 7, 9, 10]
  );
  assert.deepEqual(
    mergeArray([1, 2, 3], null),
    [1, 2, 3]
  );
});
