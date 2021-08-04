import 'core-js';
import { UAInfo } from '@/index';
const QUnit = (<any>window).QUnit;

const uaList = [
  'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/4.0; WOW64; Trident/5.0; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET CLR 2.0.50727; Media Center PC 6.0; Maxthon 2.0)',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36',
  'Mozilla/5.0 (Linux;U;Android 5.1.1;zh-CN;OPPO A33 Build/LMY47V) AppleWebKit/537.36(KHTML,like Gecko) Version/4.0 Chrome/40.0.2214.89 UCBrowser/11.7.0.953 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; U; Android 4.1.2; en-us; HUAWEI G730-C00 Build/HuaweiG730-C00) AppleWebKit/533.1 (KHTML, like Gecko)Version/4.0 MQQBrowser/4.2 Mobile Safari/533.1',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36 Edg/89.0.774.68',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/18.17763'
];
const UAInfoList = uaList.map(function(ua) {
  return new UAInfo(ua);
});

QUnit.start();

QUnit.test('main', function(assert: any) {
  assert.ok(UAInfoList[0].os.isWindows);
  assert.ok(UAInfoList[0].os.version.eq('6.1'));
  assert.ok(UAInfoList[0].browser.isIE);
  assert.ok(UAInfoList[0].browser.version.gte('9.0'));
  assert.ok(UAInfoList[0].client.isMaxthon);
  assert.ok(UAInfoList[0].client.version.lt('3.0'));
  assert.ok(!UAInfoList[0].isPortable);

  assert.ok(UAInfoList[1].os.isIOS);
  assert.ok(UAInfoList[1].os.version.gt('12.0'));
  assert.ok(UAInfoList[1].brand.isApple);
  assert.ok(UAInfoList[1].browser.isSafari);
  assert.ok(UAInfoList[1].browser.version.eq('12.1'));
  assert.ok(UAInfoList[1].client.isSafari);
  assert.ok(UAInfoList[1].client.version.lte('12.2'));
  assert.ok(UAInfoList[1].isPortable);

  assert.ok(UAInfoList[2].os.isMacOS);
  assert.ok(UAInfoList[2].os.version.lte('12.0'));
  assert.ok(UAInfoList[2].brand.isApple);
  assert.ok(UAInfoList[2].browser.isChrome);
  assert.ok(UAInfoList[2].browser.version.gt('49.0'));
  assert.ok(UAInfoList[2].client.isChrome);
  assert.ok(UAInfoList[2].client.version.lt('49.8'));
  assert.ok(!UAInfoList[2].isPortable);

  assert.ok(UAInfoList[3].os.isAndroid);
  assert.ok(UAInfoList[3].os.version.eq('5.1.1'));
  assert.ok(UAInfoList[3].brand.isOppo);
  assert.ok(UAInfoList[3].browser.isChrome);
  assert.ok(UAInfoList[3].browser.version.gte('40.0'));
  assert.ok(UAInfoList[3].client.isUCBrowser);
  assert.ok(UAInfoList[3].client.version.lte('12.0'));
  assert.ok(UAInfoList[3].isPortable);

  assert.ok(UAInfoList[4].os.isAndroid);
  assert.ok(UAInfoList[4].os.version.gte('4.1.2'));
  assert.ok(UAInfoList[4].brand.isHuawei);
  assert.ok(UAInfoList[4].browser.isSafari);
  assert.ok(UAInfoList[4].browser.version.eq('4.0'));
  assert.ok(UAInfoList[4].client.isQQBrowser);
  assert.ok(UAInfoList[4].isPortable);
});

QUnit.test('edge', function(assert: any) {
  assert.ok(UAInfoList[5].os.isWindows);
  assert.ok(UAInfoList[5].os.version.eq('10.0'));
  assert.ok(UAInfoList[5].browser.isChrome);
  assert.ok(UAInfoList[5].browser.version.gt('89'));
  assert.ok(UAInfoList[5].client.isEdge);
  assert.ok(UAInfoList[5].client.version.gt('89'));

  assert.ok(UAInfoList[6].browser.isEdge);
  assert.ok(UAInfoList[6].browser.version.gt('18'));
  assert.ok(UAInfoList[6].client.isEdge);
  assert.ok(UAInfoList[6].client.version.gt('18'));
});

QUnit.test('feature-info', function(assert: any) {
  const uaInfo = new UAInfo(uaList[2], {
    maxTouchPoints: 5
  });
  assert.ok(uaInfo.os.isIOS);
  assert.ok(uaInfo.brand.isIPad);
  assert.ok(!uaInfo.brand.isMacBook);
  assert.ok(uaInfo.isPortable);
});
