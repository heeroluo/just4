import { $ } from '@/index';
const QUnit = (<any>window).QUnit;


QUnit.start();

QUnit.test('Content box', function(assert: any) {
  const $node = $('<div style="width: 100px; height: 50px; margin: 10px; padding: 20px; border: 5px solid; visibility: hidden;"></div>').appendTo('body');
  assert.strictEqual($node.width(), 100, 'Width');
  assert.strictEqual($node.height(), 50, 'height');
  assert.strictEqual($node.innerWidth(), 140, 'Inner width');
  assert.strictEqual($node.innerHeight(), 90, 'Inner height');
  assert.strictEqual($node.outerWidth(), 150, 'Outer width');
  assert.strictEqual($node.outerHeight(), 100, 'Outer height');
  assert.strictEqual($node.outerWidth(true), 170, 'Outer width (include margin)');
  assert.strictEqual($node.outerHeight(true), 120, 'Outer height (include margin)');
});

QUnit.test('Border box', function(assert: any) {
  const $node = $('<div style="box-sizing: border-box; width: 100px; height: 50px; margin: 10px; padding: 20px; border: 5px solid; visibility: hidden;"></div>').appendTo('body');
  assert.strictEqual($node.width(), 50, 'Width');
  assert.strictEqual($node.height(), 0, 'height');
  assert.strictEqual($node.innerWidth(), 90, 'Inner width');
  assert.strictEqual($node.innerHeight(), 40, 'Inner height');
  assert.strictEqual($node.outerWidth(), 100, 'Outer width');
  assert.strictEqual($node.outerHeight(), 50, 'Outer height');
  assert.strictEqual($node.outerWidth(true), 120, 'Outer width (include margin)');
  assert.strictEqual($node.outerHeight(true), 70, 'Outer height (include margin)');
});
