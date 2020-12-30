import { $ } from '@/index';
const QUnit = (<any>window).QUnit;


QUnit.start();

QUnit.test('Scroll', function(assert: any) {
  let $node = $(
    `<div id="scroll-top-el" style="height: 100px; overflow: auto; visibility: hidden;">
	    <div style="height: 300px;"></div>
    </div>`
  ).appendTo('body');
  assert.strictEqual($node.scrollTop(), 0, 'Get scroll top');
  $node.scrollTop(100);
  assert.strictEqual($node.scrollTop(), 100, 'Set scroll top');
  $node.remove();

  $node = $(
    `<div id="scroll-left-el" style="width: 100px; height: 50px; overflow: auto; visibility: hidden;">
      <div style="width: 300px; height: 50px;"></div>
    </div>`
  ).appendTo('body');
  assert.equal($node.scrollLeft(), 0, 'Get scroll left');
  $node.scrollLeft(50);
  assert.equal($node.scrollLeft(), 50, 'Set scroll left');
  $node.remove();
});
