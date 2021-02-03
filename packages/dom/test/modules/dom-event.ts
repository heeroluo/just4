import { $ } from '@/index';
import { EventWrap } from '@/event-wrap';
const QUnit = (<any>window).QUnit;


QUnit.start();

QUnit.test('Basic on and off', function(assert: any) {
  const logs: number[] = [];
  function handler1() { logs.push(1); }
  function handler2() { logs.push(2); }

  const $test = $('<div id="test"></div>').appendTo('body');

  $test.on('click', handler1);
  $test.click(); // 1

  $test.on('click', handler2);
  $test.click(); // 1、2

  $test.off('click', handler1);
  $test.click(); // 2

  $test.remove();

  assert.deepEqual(logs, [1, 1, 2, 2]);
});

QUnit.test('Off', function(assert: any) {
  const $test = $('<div id="test"></div>').appendTo('body');

  const logs: string[] = [];
  function handler1(e: EventWrap) { logs.push(e.type + '1'); }
  function handler2(e: EventWrap) { logs.push(e.type + '2'); }

  $test.on('mouseover', handler1);
  $test.on('mouseover', handler2);
  $test.on('mouseout', handler1);
  $test.on('mouseout', handler2);

  $test.off('mouseover');
  $test.trigger('mouseover');
  $test.trigger('mouseout'); // mouseout1、mouseout2

  $test.on('click', handler1);
  $test.off();
  $test.trigger('mouseover');
  $test.trigger('mouseout');
  $test.click();

  $test.remove();

  assert.deepEqual(logs, ['mouseout1', 'mouseout2']);
});

QUnit.test('Event delegate', function(assert: any) {
  const logs: string[] = [];

  const $test = $('<div id="test"><div class="test1"></div><div class="test2"></div></div>');
  $test.on('click', '.test1', function(e) {
    logs.push((<HTMLElement>e.target).className);
  });

  $test.click();
  $test.children().click();
  $test.off();
  $test.children().click();

  assert.deepEqual(logs, ['test1']);
});
