import { querySelectorAll, matchesSelector } from '@/selector';
const QUnit = (<any>window).QUnit;


QUnit.start();

const HTML = `<div id="test-div">
  <span>123</span>
  <input type="button" />
  <div><span>456</span></div>
</div><p>abc</p>`;

const div = document.createElement('div');
div.innerHTML = HTML;
div.style.display = 'none';
document.body.appendChild(div);

const testDiv = document.getElementById('test-div');

QUnit.test('querySelectorAll', (assert: any) => {
  assert.strictEqual(querySelectorAll('#test-div', document).length, 1);
  assert.strictEqual(querySelectorAll('span', testDiv).length, 2);
  assert.strictEqual(querySelectorAll('div span', testDiv).length, 1);
  assert.strictEqual(querySelectorAll('input[type=button]', testDiv).length, 1);
  assert.strictEqual(querySelectorAll('+p', testDiv).length, 1);
});

QUnit.test('matchesSelector', (assert: any) => {
  assert.strictEqual(matchesSelector(testDiv, '#test-div'), true);
  assert.strictEqual(matchesSelector(testDiv, 'span'), false);
  assert.strictEqual(
    matchesSelector(querySelectorAll('span', testDiv)[0], '#test-div span'),
    true
  );
  assert.strictEqual(
    matchesSelector(querySelectorAll('span', testDiv)[0], '#test-div div span'),
    false
  );
  assert.strictEqual(
    matchesSelector(document.createElement('div'), 'div'),
    true
  );
});
