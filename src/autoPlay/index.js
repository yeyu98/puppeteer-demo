/*
 * @Author: yeyu98
 * @Date: 2024-07-11 22:34:55
 * @LastEditors: yeyu98
 * @LastEditTime: 2024-07-11 22:56:29
 * @Description: 
 */

const puppeteer = require('puppeteer')

const {USER, PASSWORD, TARGET_URL} = require('./constant')
const {sleep} = require('./utils')


const autoPlay = async () => {
    const browser = await puppeteer.launch({headless: false})
    try {
        const page = await browser.newPage()
        await page.setViewport({
            width: 1920,
            height: 1000
        })
        await page.goto(TARGET_URL)
        await page.type("#phone", USER)
        await sleep()
        await page.type('#pwd', PASSWORD)
        await sleep()
        await page.click('#loginBtn')
        await page.waitForNavigation({
            waitUntil: 'load'
        })

        // .menubar  a 1

        // 点击进入培训点
        await page.evaluate(() => {
            const trainingPointBtn = document.querySelectorAll('.menubar  a')[1]
            trainingPointBtn.click()
        })
        
        // 等待课程入口出现
        await page.waitForSelector('.l_tcourse_item')
        await page.evaluate(() => {
            const courseEntry = document.querySelectorAll('.l_tcourse_item  li')[0]
            courseEntry.click()
        })
        

        // 等待课程入口出现
        await page.waitForSelector('.l_tcourse_item')



    }catch(err) {
        console.log("err --->>>", err)
        await browser.close()
    }
}

module.exports = {
    autoPlay
}