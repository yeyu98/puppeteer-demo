<!--
 * @Author: yeyu98
 * @Date: 2024-07-13 17:18:09
 * @LastEditors: yeyu98
 * @LastEditTime: 2024-07-21 11:30:57
 * @Description: 
-->
- 如何获取当前页面打开的新页面的page？
  - 方案一：通过browser.once监听targetcreated事件，当新页面打开时返回当前页（成功）
  const getNewPage = (browser) => new Promise(resolve => browser.once("targetcreated", target => resolve(target.page())))

  - 方案二 通过browser.pages 根据索引来获取（目前来看只能获取到最新页面之前的页面，没成功）


- 如何抓取iframe下的元素？
- page.waitForFrame(f => f.name() === 'xxx')
- page.frames().find(f  => f .name() === 'xxx')

- 如何让puppeteer避免重复登录？
  - 利用chrome远程调试的方法将puppeteer启动浏览器和进入浏览器页面拆分成两步
  - 第一 右键浏览器快捷方式设置目标："C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 
    - 之后将所有chrome都关闭，启动设置过后的浏览器，访问http://127.0.0.1:9222/json/version；
    - 获取到"webSocketDebuggerUrl": "ws://127.0.0.1:9222/devtools/browser/c9ecd2e4-4133-4700-853d-7c74f3f8f559"
  - 第二 通过puppeteer提供的 puppeteer.connect 使用ws连接上9222端口下的浏览器，替代每次都需要启动关闭的puppeteer浏览器；