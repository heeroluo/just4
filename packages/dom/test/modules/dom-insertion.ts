import { $ } from '@/index';
const QUnit = (<any>window).QUnit;


QUnit.start();

interface TestData {
  type: string,
  value: any
}

// 获取测试用的数据，四种类型String,Element,ArrayLike<Element>,DocumentFragment
function getTestData(): TestData[] {
  const str = '<div class="test"></div>';
  const el = document.createElement('div');
  el.className = 'test';
  const arr = [<HTMLElement>el.cloneNode()];
  return [
    { type: 'String', value: str },
    { type: 'Element', value: el },
    { type: 'ArrayLike<HTMLElement>', value: arr }
  ];
}

const DIV_WITH_CHILD = '<div><div class="child"></div></div><div><div class="child"></div></div>';

QUnit.test('append', function(assert: any) {
  const $node = $(DIV_WITH_CHILD).appendTo('body');
  getTestData().forEach(function(item) {
    $node.append(item.value);
    assert.strictEqual(
      (<HTMLElement>$node.children().get(-1)).className,
      'test',
      item.type + '类型测试'
    );
  });
  assert.strictEqual($node.children().length, 8);
  $node.remove();
});

QUnit.test('appendTo', function(assert: any) {
  const $node = $(DIV_WITH_CHILD).appendTo('body');
  getTestData().forEach(function(item) {
    $(item.value).appendTo($node);
    assert.strictEqual(
      (<HTMLElement>$node.children().get(-1)).className,
      'test',
      item.type + '类型测试'
    );
  });
  assert.strictEqual($node.children().length, 8);
  $node.remove();
});

QUnit.test('prepend', function(assert: any) {
  const $node = $(DIV_WITH_CHILD).appendTo('body');
  getTestData().forEach(function(item) {
    $node.prepend(item.value);
    assert.strictEqual(
      (<HTMLElement>$node.children().get(0)).className,
      'test',
      item.type + '类型测试'
    );
  });
  assert.strictEqual($node.children().length, 8);
  $node.remove();
});

QUnit.test('prependTo', function(assert: any) {
  const $node = $(DIV_WITH_CHILD).appendTo('body');
  getTestData().forEach(function(item) {
    $(item.value).prependTo($node);
    assert.strictEqual(
      (<HTMLElement>$node.children().get(0)).className,
      'test',
      item.type + '类型测试'
    );
  });
  assert.strictEqual($node.children().length, 8);
  $node.remove();
});

QUnit.test('before', function(assert: any) {
  const $node = $(DIV_WITH_CHILD).appendTo('body');
  getTestData().forEach(function(item) {
    $node.children('.child').before(item.value);
    assert.strictEqual(
      (<HTMLElement>$node.children().get(0)).className,
      'test',
      item.type + '类型测试'
    );
  });
  assert.strictEqual($node.children().length, 8);
  $node.remove();
});

QUnit.test('insertBefore', function(assert: any) {
  const $node = $(DIV_WITH_CHILD).appendTo('body');
  getTestData().forEach(function(item) {
    $(item.value).insertBefore($node.children('.child'));
    assert.strictEqual(
      (<HTMLElement>$node.children().get(0)).className,
      'test',
      item.type + '类型测试'
    );
  });
  assert.strictEqual($node.children().length, 8);
  $node.remove();
});

QUnit.test('after', function(assert: any) {
  const $node = $(DIV_WITH_CHILD).appendTo('body');
  getTestData().forEach(function(item) {
    $node.children('.child').after(item.value);
    assert.strictEqual(
      (<HTMLElement>$node.children().get(-1)).className,
      'test',
      item.type + '类型测试'
    );
  });
  assert.strictEqual($node.children().length, 8);
  $node.remove();
});

QUnit.test('insertAfter', function(assert: any) {
  const $node = $(DIV_WITH_CHILD).appendTo('body');
  getTestData().forEach(function(item) {
    $(item.value).insertAfter($node.children('.child'));
    assert.strictEqual(
      (<HTMLElement>$node.children().get(-1)).className,
      'test',
      item.type + '类型测试'
    );
  });
  assert.strictEqual($node.children().length, 8);
  $node.remove();
});

QUnit.test('replaceWith', function(assert: any) {
  getTestData().forEach(function(item) {
    const $node = $(DIV_WITH_CHILD).appendTo('body');
    $node.children().replaceWith(item.value);
    assert.strictEqual(
      $node.children().prop('className'),
      'test',
      item.type + '类型测试'
    );
    assert.strictEqual($node.children().length, 2);
    $node.remove();
  });
});

QUnit.test('replaceAll', function(assert: any) {
  getTestData().forEach(function(item) {
    const $node = $(DIV_WITH_CHILD).appendTo('body');
    $(item.value).replaceAll($node.children());
    assert.strictEqual(
      $node.children().prop('className'),
      'test',
      item.type + '类型测试'
    );
    assert.strictEqual($node.children().length, 2);
    $node.remove();
  });
});

QUnit.test('remove', function(assert: any) {
  const $node = $('<div><p></p></div>').appendTo('body');
  const $p = $node.children().eq(0).data('key', 'value');
  $p.remove();
  assert.strictEqual($node.children().length, 0, '节点已移除');
  assert.strictEqual($p.data('key'), undefined, '数据已删除');
  $node.remove();
});

QUnit.test('empty', function(assert: any) {
  const $node = $('<div><p></p></div>').appendTo('body');
  const $p = $node.children().eq(0).data('key', 'value');
  $node.empty();
  assert.strictEqual($node.children().length, 0, '节点已移除');
  assert.strictEqual($p.data('key'), undefined, '数据已删除');
  $node.remove();
});

QUnit.test('clone', function(assert: any) {
  const $node = $('<div><p></p></div>').appendTo('body').data('key', 'value');
  $node.children().data('key2', 'value2');

  const $nodeCl1 = $node.clone();
  assert.strictEqual($nodeCl1.length, 1);
  assert.strictEqual($nodeCl1.data('key'), undefined, '未克隆节点数据');
  assert.strictEqual($nodeCl1.children().data('key2'), undefined, '未克隆后代节点数据');

  const $nodeCl2 = $node.clone(true);
  assert.strictEqual($nodeCl2.data('key'), 'value', '已克隆节点数据');
  assert.strictEqual($nodeCl2.children().data('key2'), undefined, '未克隆后代节点数据');

  const $nodeCl3 = $node.clone(true, true);
  assert.strictEqual($nodeCl3.data('key'), 'value', '已克隆节点数据');
  assert.strictEqual($nodeCl3.children().data('key2'), 'value2', '已克隆后代节点数据');

  $node.remove();
});
