<!--
 * @Author: yeyu98
 * @Date: 2024-07-13 17:18:09
 * @LastEditors: yeyu98
 * @LastEditTime: 2024-07-13 22:27:11
 * @Description: 
-->
- 如何获取当前页面打开的新页面的page？
  - 方案一：通过browser.once监听targetcreated事件，当新页面打开时返回当前页（成功）
  const getNewPage = (browser) => new Promise(resolve => browser.once("targetcreated", target => resolve(target.page())))

  - 方案二 通过browser.pages 根据索引来获取（目前来看只能获取到最新页面之前的页面，没成功）


- 如何抓取iframe下的元素？
- page.waitForFrame(f => f.name() === 'xxx')
- page.frames().find(f  => f .name() === 'xxx')