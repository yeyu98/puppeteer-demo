/*
 * @Author: yeyu98
 * @Date: 2024-07-11 22:34:55
 * @LastEditors: yeyu98
 * @LastEditTime: 2024-07-13 17:51:41
 * @Description: 
 */

// const puppeteer = require('puppeteer')

const puppeteer = require('puppeteer-extra').default
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const AdblokcerPlugin = require('puppeteer-extra-plugin-adblocker').default
puppeteer.use(StealthPlugin())
puppeteer.use(AdblokcerPlugin({
    blockTrackers: true
}))

// 如何获取当前页面打开的新页面的page？
// 方式一
// 通过browser.once监听targetcreated事件，当新页面打开时返回当前页
// 方案二 通过browser.pages 根据索引来获取

const TARGET_URL = 'http://www.netbian.com/'

const getNewPage = (browser) => new Promise(resolve => browser.once("targetcreated", target => resolve(target.page())))

const main = async () => {
    const browser = await puppeteer.launch({headless: false})
    try {
        const page = await browser.newPage()
        await page.setViewport({
            width: 1920,
            height: 1000
        })
        await page.goto(TARGET_URL)
        const list = await page.$$('.menu li')
        await list[3].click()
        const newPage = await getNewPage(browser)
        await newPage.waitForSelector('.classify')
        const items = await newPage.evaluate(() => {
            const items = document.querySelectorAll('.classify a')
            return items.length
            // return items?.map(item => item.innerText)
        })
        // const items = await newPage.$$eval('.classify a', items => items.map(item => item.innerText))
        console.log("✨✨🥰  ~ items ~ items--->>>", items)
    }catch(err) {
        console.log("err --->>>", err)
        await browser.close()
    }
}

main()