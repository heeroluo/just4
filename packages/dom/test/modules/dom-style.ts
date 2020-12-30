import { $ } from '@/index';
const QUnit = (<any>window).QUnit;


QUnit.start();

QUnit.test('Style', function(assert: any) {
  const $node = $('<div style="padding: 10px;"></div>').appendTo('body');
  assert.strictEqual($node.css('padding-right'), '10px');
});

QUnit.test('Visibility', function(assert: any) {
  const $node = $('<div></div>').appendTo('body');
  $node.hide();
  assert.strictEqual($node.css('display'), 'none', 'Hide');
  $node.show();
  assert.strictEqual($node.css('display'), 'block', 'Show');
});
