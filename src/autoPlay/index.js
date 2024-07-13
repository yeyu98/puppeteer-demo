/*
 * @Author: yeyu98
 * @Date: 2024-07-11 22:34:55
 * @LastEditors: yeyu98
 * @LastEditTime: 2024-07-13 20:19:59
 * @Description: 
 */

const puppeteer = require('puppeteer')

const {USER, PASSWORD, TARGET_URL} = require('./constant')
const {sleep, getNewPage, convertSeconds} = require('./utils')
// 选中 -- 提交 -- 继续
const OPERATION_TIME = 3000


const getTotalSeconds = async (coursePage) => {
    return new Promise(async (resolve, reject) => {
        await coursePage.waitForSelector('.vjs-duration-display')
        const currentTimeStr = await coursePage.$eval('.vjs-current-time-display', el => el.innerText)
        const totalTimeStr = await coursePage.$eval('.vjs-duration-display', el => el.innerText)
        const currentTimeList = currentTimeStr?.split(':')
        const totalTimeList = totalTimeStr?.split(':')
        const currentSeconds = convertSeconds(currentTimeList)
        const totalTimeSeconds = convertSeconds(totalTimeList) + OPERATION_TIME
        const times = totalTimeSeconds - currentSeconds
        console.log(`✨✨🥰 已开始时间${currentSeconds}` )
        console.log(`✨✨🥰 整体时间${totalTimeSeconds}` )
        console.log(`✨✨🥰 剩余时间${times}` )
        resolve(times)
    })
}

const startStudyCourse = (browser) => {
    return new Promise(async (resolve, reject) => {
        const coursePage = await getNewPage(browser)
        await coursePage.waitForSelector('.fullScreenContainer')
        const courseName = await coursePage.$eval('.prev_title', el => el.innerText)
        // video_html5_api 开始播放
        await coursePage.$eval('#video_html5_api', el => {
            el.play();
            console.log(`课程：${courseName} 开始播放`)
            el.addEventListener("paused", async function() {     
                // video_html5_api 监听视频播放是否暂停，如果暂停则判断是否是互动答题 tkTopic
                // 查找 .tkItem_ul li 点击
                // sleep()
                // #videoquiz-submit click
                // waitFor #videoquiz-continue  click
                console.log(`课程：${courseName} 暂停播放`)
                await coursePage.waitForSelector('.tkTopic')
                console.log(`开始互动答题`)
                await coursePage.$eval('.tkItem_ul li', items => items[0].click())
                await sleep()
                await coursePage.$eval('#videoquiz-submit', el => el.click())
                await sleep()
                await coursePage.$eval('#videoquiz-continue', el => el.click())
                console.log(`课程：${courseName} 继续播放`)
            })
        })
        const totalTimes = await getTotalSeconds(coursePage)

        console.log(`✨✨🥰 视频一共${seconds / 1000} 秒`)
        
        setTimeout(() => {
            coursePage.close()
            resolve({
                courseName,
                isFinished: true
            })
        }, totalTimes);
    }).catch(err => {
        console.log("✨✨🥰  ~ returnnewPromise ~ err--->>>", err)
        resolve({
            courseName,
            isFinished: false
        })
    })
}

const enterCategoryPage = async (browser) => {
    let count = 0
    const categoryPage = await getNewPage(browser)
    // 等待章节列表出现
    await categoryPage.waitForSelector('.catalog_level')
    const categoryList = await categoryPage.$$('.catalog_level li')
    if(categoryList.length > 0) {
        for(let i=0; i<categoryList.length; i++) {
            const item = categoryList[i]
            await item.click()
            const {courseName, isFinished} = await startStudyCourse(browser)
            if(isFinished) {
                console.log(`✨✨🥰 课程：${courseName} 已完成`)
                count++;
            } else {
                console.log(`✨✨🥰 课程：${courseName} 未完成`)
            }
        }
    }
}

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
        

        // 等待进入课程学习按钮
        await page.waitForSelector('.l_tcourse_btn')
        await page.evaluate(() => {
            const studyEntry = document.querySelectorAll('.l_tcourse_btn')[1]
            studyEntry.click()
        })

        // 获取分页数量
        const pageNumber = await page.$$eval('.pageDiv li', pages => pages.length - 2)

        // 开始学习
        for(let i = 0; i < pageNumber; i++) { 
            await page.evaluate(async () => {
                const courseList = document.querySelectorAll('.l_ib_crow .l_tcourse_list')
                const _courseList = [...courseList]
                if(_courseList.length > 0) {
                    for(let i=0; i<_courseList.length; i++) {
                        const courseItem = _courseList[i]
                        const progressStr = courseItem.querySelector('.l_tcourse_item  .l_sprogress_item')?.style?.width
                        const progress = parseFloat(progressStr?.replace(/%/g, ''))
                        if(progress < 100) { 
                            await courseItem.click()
                            await enterCategoryPage(browser)
                        }
                    }
                } 
            })
        }




    }catch(err) {
        console.log("err --->>>", err)
        await browser.close()
    }
}

module.exports = {
    autoPlay
}