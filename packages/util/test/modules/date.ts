import { addRelativeTime } from '@/index';
const QUnit = (<any>window).QUnit;


QUnit.start();

QUnit.test('addRelativeTime', (assert: any) => {
  assert.strictEqual(addRelativeTime(new Date(2020, 0, 1), '1 hour').getTime(), 1577811600000);
  assert.strictEqual(addRelativeTime(new Date(2020, 0, 1), '2 months').getTime(), 1582992000000);
});
