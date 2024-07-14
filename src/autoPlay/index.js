/*
 * @Author: yeyu98
 * @Date: 2024-07-11 22:34:55
 * @LastEditors: yeyu98
 * @LastEditTime: 2024-07-13 22:55:42
 * @Description: 
 */

const puppeteer = require('puppeteer')

const {USER, PASSWORD, TARGET_URL} = require('./constant')
const {sleep, getNewPage, convertSeconds} = require('./utils')
// 选中 -- 提交 -- 继续
const OPERATION_TIME = 3000


const getTotalSeconds = async (courseFrame) => {
    return new Promise(async (resolve, reject) => {
        await courseFrame.waitForSelector('.vjs-duration-display')
        const currentTimeStr = await courseFrame.$eval('.vjs-current-time-display', el => el.innerText)
        const totalTimeStr = await courseFrame.$eval('.vjs-duration-display', el => el.innerText)
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
        await sleep(2000)
        const courseFrame = await coursePage.frames()[0]
        await courseFrame.waitForSelector('.fullScreenContainer')
        const courseName = await courseFrame.$eval('.prev_title', el => el.innerText)
        // video_html5_api 开始播放
        await courseFrame.$eval('#video_html5_api', el => {
            el.play();
            console.log(`课程：${courseName} 开始播放`)
            el.addEventListener("paused", async function() {     
                // video_html5_api 监听视频播放是否暂停，如果暂停则判断是否是互动答题 tkTopic
                // 查找 .tkItem_ul li 点击
                // sleep()
                // #videoquiz-submit click
                // waitFor #videoquiz-continue  click
                console.log(`课程：${courseName} 暂停播放`)
                await courseFrame.waitForSelector('.tkTopic')
                console.log(`开始互动答题`)
                await courseFrame.$eval('.tkItem_ul li', items => items[0].click())
                await sleep(1500)
                await courseFrame.$eval('#videoquiz-submit', el => el.click())
                await sleep(1500)
                await courseFrame.$eval('#videoquiz-continue', el => el.click())
                console.log(`课程：${courseName} 继续播放`)
            })
        })
        const totalTimes = await getTotalSeconds(courseFrame)

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
    const categoryFrame = await categoryPage.waitForFrame(f => f.name() === 'frame_content-zj')
    // 等待章节列表出现
    await categoryFrame.waitForSelector('.catalog_level')
    const categoryList = await categoryFrame.$$('.catalog_level li')
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
        await sleep()

        // 点击进入培训点
        // await page.evaluate(() => {
        //     const trainingPointBtn = document.querySelectorAll('.menubar  a')[1]
        //     trainingPointBtn.click()
        // })

        page.$$eval('.menubar  a', items => items[1].click())
        await sleep()
        

        // 进入班级列表
        const classFrame = await page.waitForFrame(f => f.name() === 'frame_content')
        await classFrame.waitForSelector('.l_ib_crow')
        await classFrame.$eval('.l_tcourse_list', el => el.click())


        // 进入课程列表
        const courseFrame = await page.waitForFrame(f => f.name() === 'frame_content')
        // 获取分页数量
        const pageNumber = await courseFrame.$$eval('.pageDiv li', pages => pages.length - 2)
        // 开始学习
        for(let i = 0; i < pageNumber; i++) { 
            await courseFrame.evaluate(async () => {
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