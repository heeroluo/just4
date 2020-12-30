import { $ } from '@/index';
const QUnit = (<any>window).QUnit;


QUnit.start();

QUnit.test('Fixed element', (assert: any) => {
  const $test = $('<div style="position: fixed; left: 100px; top: 100px;"></div>').appendTo('body');
  assert.deepEqual($test.offset(), { top: 100, left: 100 });
  $test.remove();
});

QUnit.test('Absolute element', (assert: any) => {
  const $test = $('<div style="position: absolute; left: 100px; top: 100px;"><div style="position: absolute; left: 50px; top: 50px;"></div></div>').appendTo('body');
  assert.deepEqual($test.children().offset(), { top: 150, left: 150 });
  $test.remove();
});

QUnit.test('Static element', (assert: any) => {
  const $test = $('<div style="margin: 10px;"></div>').prependTo('body');
  $test.prevAll();
  assert.deepEqual($test.offset(), {
    top: 10,
    left: 10,
  });
  $test.remove();
});
