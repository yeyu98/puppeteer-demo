/*
 * @Author: yeyu98
 * @Date: 2024-04-12 20:59:29
 * @LastEditors: yeyu98
 * @LastEditTime: 2024-04-13 11:01:06
 * @Description: 
 */
// 提取网站图片
// 有些网站 body 下直接是一个iframe iframe下才是主体内容
/**
 * img
 * svg
 * style标签中的 background background-image
 *  link type='text/css' rel='stylesheet'
 * link href rel='ico' 主要是ico
 * */ 

// 先考虑img 和 svg 两种情况看看怎么爬取
// 滚动懒加载的网站如何抓取 边滚动 等待一段时间 看看 scrollTop < scrollHeight  是否成立如果成立则证明是懒加载的网站

// 问题记录
/**
 * 使用puppeteer进入网站多次会触发反爬比如需要走一些真人验证
    * puppeteer-extra  
    * puppeteer-extra-plugin-stealth 防止触发反爬校验 原理有待研究
    * puppeteer-extra-plugin-adblocker: 开了之后无法启动暂时先不加 拦截广告
 */ 

const puppeteer = require('puppeteer-extra').default
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const AdblokcerPlugin = require('puppeteer-extra-plugin-adblocker').default
puppeteer.use(StealthPlugin())
puppeteer.use(AdblokcerPlugin({
    blockTrackers: true
}))

const targetUrl = 'https://www.pexels.com/zh-cn/'

const main = async () => {
    // 打开浏览器
    console.log("✨✨✨ 浏览器启动中...")
    console.time('time')
    const browser = await puppeteer.launch({headless: true, timeout: 20000})
    // 打开窗口
    const page = await browser.newPage()
    await page.goto(targetUrl)
    await page.waitForSelector('body')
    console.log(`🥰🥰🥰 ${targetUrl} 加载成功` )
    console.timeEnd('time')
    const imgAssets = await page.evaluate(() => {
        const imgs = document.querySelectorAll('img')
        const svg = document.querySelectorAll('svg')
        console.log(svg)
        const imgList = [...imgs].map(item => item.src)
        const svgList = [...svg].map(item => item.outerHTML)

        return {
            imgList,
            svgList
        }
    })
    console.log("✨✨🥰  ~ imgAssets ~ imgAssets--->>>", imgAssets.svgList)

    await browser.close()

}

module.exports = main