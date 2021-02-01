import { toArray, mergeArray } from '@/array';
const QUnit = (<any>window).QUnit;


QUnit.start();

QUnit.test('toArray', (assert: any) => {
  // 类数组
  const bodyList = document.getElementsByTagName('body');
  const bodyArr = toArray(bodyList);
  assert.strictEqual(Array.isArray(bodyArr), true);
  assert.strictEqual(bodyArr.length, bodyList.length);
  assert.strictEqual(bodyArr[0], bodyList[0]);

  // 非类数组
  const arr = toArray(<any>{});
  assert.strictEqual(Array.isArray(arr), true);
  assert.strictEqual(arr.length, 0);
});

QUnit.test('mergeArray', (assert: any) => {
  const arr = [1, 2, 3];
  const merge1 = mergeArray(arr, null);
  assert.ok(arr === merge1);
  assert.deepEqual(merge1, [1, 2, 3]);

  assert.deepEqual(
    mergeArray(arr, [7, 9, 10]),
    [1, 2, 3, 7, 9, 10]
  );
});
