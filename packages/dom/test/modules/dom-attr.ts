import { $ } from '@/index';
const QUnit = (<any>window).QUnit;


QUnit.start();

QUnit.test('Attribute', function(assert: any) {
  const DATA_VALUE = 'data-value';

  let $node = $('<input type="checkbox" data-value="1" checked />');
  assert.strictEqual($node.attr(DATA_VALUE), '1', 'Get attribute');

  $node.attr(DATA_VALUE, '2');
  assert.strictEqual($node.attr(DATA_VALUE), '2', 'Set attribute');

  $node.removeAttr(DATA_VALUE);
  assert.equal($node.attr(DATA_VALUE), null, 'Remove attribute');

  assert.strictEqual($node.attr('checked'), 'checked', 'Get boolean attribute');
  $node.removeAttr('checked');
  assert.strictEqual($node.attr('checked'), null, 'Remove boolean attribute');

  $node = $('<a href="./test">abc</a>');
  assert.strictEqual($node.attr('href'), './test', 'Get href attribute');
});

QUnit.test('Property', function(assert: any) {
  let $node = $('<input type="checkbox" checked />');
  assert.strictEqual($node.prop('checked'), true, 'Get property');

  $node.prop('checked', false);
  assert.strictEqual($node.prop('checked'), false, 'Set property');

  $node = $('<a href="./test">abc</a>');
  assert.notEqual($node.prop('href'), './test', 'Get href property');
});

QUnit.test('.text()', function(assert: any) {
  const $node = $('<div><p>test</p></div>');
  assert.strictEqual($node.text(), 'test', 'Get text content');

  $node.text('<test again>');
  assert.strictEqual($node.text(), '<test again>', 'Set text content');
});

QUnit.test('.html()', function(assert: any) {
  const $node = $('<div><p>test</p></div>');
  assert.strictEqual($node.html().toLowerCase(), '<p>test</p>', 'Get inner html');

  $node.html('test again');
  assert.strictEqual($node.html().toLowerCase(), 'test again', 'Set inner html');
});

QUnit.test('.val()', function(assert: any) {
  const $node = $('<input value="old content" />');
  assert.equal($node.val(), 'old content', 'Get value');
  $node.val('new content');
  assert.equal($node.val(), 'new content', 'Set value');
});
