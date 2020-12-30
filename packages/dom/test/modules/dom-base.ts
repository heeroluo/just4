import { uniqueSort } from '@/internal/dom-base';
import { querySelectorAll } from '@/selector';
const QUnit = (<any>window).QUnit;


QUnit.start();

const HTML = `<div id="test-div">
  <span>123</span>
  <div><span>456</span></div>
</div><p>abc</p>`;

const div = document.createElement('div');
div.innerHTML = HTML;
div.style.display = 'none';
document.body.appendChild(div);

const testDiv = document.getElementById('test-div');

QUnit.test('uniqueSort', (assert: any) => {
  const firstSpan = querySelectorAll('span', testDiv)[0];
  const secondSpan = querySelectorAll('div span', testDiv)[0];
  const innerDiv = querySelectorAll('div', testDiv)[0];
  const p = querySelectorAll('p', div)[0];
  const disconnectedElem = document.createElement('a');

  const result = uniqueSort([
    disconnectedElem,
    firstSpan,
    document.body,
    document,
    secondSpan,
    div,
    testDiv,
    innerDiv,
    firstSpan,
    window,
    p
  ]);

  assert.deepEqual(result, [
    document,
    document.body,
    div,
    testDiv,
    firstSpan,
    innerDiv,
    secondSpan,
    p,
    disconnectedElem,
    window
  ]);
});
