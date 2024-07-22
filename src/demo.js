/*
 * @Author: yeyu98
 * @Date: 2024-07-11 22:34:55
 * @LastEditors: yeyu98
 * @LastEditTime: 2024-07-14 11:49:30
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

const TARGET_URL = 'https://music.163.com/#'

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
        const frame = await page.waitForFrame(frame => {
            return frame.name() === 'contentFrame'
        })
        // const frame = await page.frames().find(frame => frame.name() === 'contentFrame')

        
        // const list = await frame.$eval('#g_backtop', el => el.innerText)
        // console.log("✨✨🥰  ~ main ~ list--->>>", list)
        const a = await frame.evaluate(() => {
            const _list = document.querySelectorAll('.m-cvrlst.f-cb li')
            const list = [..._list]
            console.log("✨✨🥰  ~ a ~ list--->>>", list.length)
            // const result = [...list].map(item => {
            //     const a = item.querySelector('a')
            //     console.log(a)
            //     return a.title
            // })
            const result = []
            for(let i = 0; i < list.length; i++) {
                const item = list[i]
                const a = item.querySelector('a')
                result.push(a.title)
                if(i == 1) {
                    a.click()
                }
            }
            // return result
        })
        console.log("✨✨🥰  ~ a ~ a--->>>", a)

    }catch(err) {
        console.log("err --->>>", err)
        await browser.close()
    }
}

main()