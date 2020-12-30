import { $ } from '@/index';
const QUnit = (<any>window).QUnit;


QUnit.start();

QUnit.test('Get and set', function(assert: any) {
  const $node = $('body');
  assert.strictEqual($node.data('key'), undefined, 'No data');

  $node.data('key', 'value');
  assert.strictEqual($node.data('key'), 'value', 'Get data');

  $node.removeData('key');
  assert.strictEqual($node.data('key'), undefined, 'Remove single data');

  $node.data('key2', 'value2');
  $node.removeData();
  assert.strictEqual($node.data('key'), undefined, 'Remove all data');
  assert.strictEqual($node.data('key2'), undefined, 'Remove all data');
});
