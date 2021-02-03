import { $ } from '@/index';
const QUnit = (<any>window).QUnit;


QUnit.start();

$(`<div class="test-node" style="visibility: hidden;">
  <div class="dom-traversal">
    <span class="first">1</span>
    <span>2</span>
    <span id="dom-traversal-index">3</span>
    <p>4</p>
  </div>
</div>`).appendTo('body');

const ID_DOM_TRAVERSAL_INDEX = '#dom-traversal-index';

QUnit.test('index', function(assert: any) {
  assert.strictEqual($(ID_DOM_TRAVERSAL_INDEX).index(), 2);
});

QUnit.test('children', function(assert: any) {
  const $children = $('.dom-traversal').children();
  assert.strictEqual($children.length, 4);
});

QUnit.test('next', function(assert: any) {
  const $dom = $(ID_DOM_TRAVERSAL_INDEX).next();
  assert.strictEqual($dom.html(), '4');
});

QUnit.test('nextAll', function(assert: any) {
  const $first = $('.dom-traversal span').eq(0);
  assert.strictEqual($first.nextAll().length, 3);
  assert.strictEqual($first.nextAll('p').length, 1);
});

QUnit.test('prev', function(assert: any) {
  assert.strictEqual($(ID_DOM_TRAVERSAL_INDEX).prev().html(), '2');
});

QUnit.test('prevAll', function(assert: any) {
  const $p = $('.dom-traversal p');
  assert.strictEqual($p.prevAll().length, 3);
  assert.strictEqual($p.prevAll('.first').length, 1);
});

QUnit.test('parent', function(assert: any) {
  const $dom = $(ID_DOM_TRAVERSAL_INDEX);
  assert.strictEqual($dom.parent().prop('className'), 'dom-traversal');
});

QUnit.test('parents', function(assert: any) {
  const $dom = $(ID_DOM_TRAVERSAL_INDEX);
  function validate() {
    let node: Node | null = <Node>$dom.get(0);
    return $dom.parents().every(function(item) {
      if (node) { node = node.parentNode; }
      return node === item;
    });
  }
  assert.strictEqual(validate(), true);
});

QUnit.test('siblings', function(assert: any) {
  const $dom = $(ID_DOM_TRAVERSAL_INDEX);
  assert.strictEqual($dom.siblings().length, 3);
  assert.strictEqual($dom.siblings('p').length, 1);
});

QUnit.test('nextUntil', function(assert: any) {
  const $node = $('.dom-traversal').children().first();
  const $nexts = $node.nextUntil(ID_DOM_TRAVERSAL_INDEX);
  assert.strictEqual($nexts.length, 1);
  assert.strictEqual($nexts.text(), '2');
});

QUnit.test('prevUntil', function(assert: any) {
  const $node = $('.dom-traversal').children().last();
  const $prevs = $node.prevUntil('.first');
  assert.strictEqual($prevs.length, 2);
  assert.strictEqual($prevs.text(), '3');
});

QUnit.test('parentsUntil', function(assert: any) {
  const $parents = $(ID_DOM_TRAVERSAL_INDEX).parentsUntil('body');
  assert.strictEqual($parents.length, 2);
  assert.strictEqual($parents.prop('className'), 'dom-traversal');
});
