import { $ } from '@/index';
const QUnit = (<any>window).QUnit;


QUnit.start();

QUnit.test('CSS Class', function(assert: any) {
  const $node = $('<div class="atest testb atestb"></div>').appendTo('body');
  assert.strictEqual($node.hasClass('atestb'), true, 'Has class');
  assert.strictEqual($node.hasClass('test'), false, 'Has class');

  $node.addClass('newa newb');
  assert.strictEqual($node.hasClass('newa'), true, 'Add class');
  assert.strictEqual($node.hasClass('newb'), true, 'Add class');

  $node.removeClass('newa');
  assert.strictEqual($node.hasClass('newa'), false, 'Remove class');

  $node.toggleClass('newc newa');
  assert.strictEqual($node.hasClass('newc'), true, 'Toggle class');
  assert.strictEqual($node.hasClass('newa'), true, 'Toggle class');

  $node.toggleClass('newb');
  assert.strictEqual($node.hasClass('newb'), false, 'Toggle class');
});
