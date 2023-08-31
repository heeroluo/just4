import { addRelativeTime } from '@/index';
const QUnit = (<any>window).QUnit;


QUnit.start();

QUnit.test('addRelativeTime', (assert: any) => {
  assert.strictEqual(addRelativeTime(new Date(2020, 0, 1)).getTime(), new Date(2020, 0, 1).getTime());
  assert.strictEqual(addRelativeTime(new Date(2020, 0, 1), '1000').getTime(), new Date(2020, 0, 1, 0, 0, 1).getTime());
  assert.strictEqual(addRelativeTime(new Date(2020, 0, 1), '1 hour').getTime(), new Date(2020, 0, 1, 1).getTime());
  assert.strictEqual(addRelativeTime(new Date(2020, 0, 1), '2 months').getTime(), new Date(2020, 2, 1).getTime());
});
