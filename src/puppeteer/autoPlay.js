
const TARGET_URL = 'https://zjjx.rlsbt.zj.gov.cn/#/'
const ID = '362322199712267520'
const PASSWORD = 'Zhouxy578145'
const ID_INPUT = "#exampleInputUser"
const PASSWORD_INPUT = "#exampleInputPassword1"
const LOGIN = ".login_container .btn"

const puppeteer = require('puppeteer')
const { transformTimestamp } = require('../utils/index')


// TODO 1 
/* 
    进入个人中心
    查找 tab-content ng-scope:nth(3) 从第三个开始播放
    
    进入拖动滑块页面
        计算滑块容器.drag_text的width dragWrapperWidth 计算handler的width dragHandlerWidth
        dragPosition = dragWrapperWidth - dragHandlerWidth
        等待页面加载
    进入视频播放界面
        获取视频时长 videoTime = #myplayer_controlbar_duration.innerText
        需要将时长转换成时间戳再换算成 s
        开启定时器 
        定时器结束关闭网页
    进入下一个循环
*/

const autoPlay = async() => {
    // NOTE 发现个很神奇的事情，在node中try和catch是两个不同的作用域
    const browser = await puppeteer.launch({headless: false})
    try {
        const page = await browser.newPage()
        await page.setViewport({
            width: 1920,
            height: 1000
        })
        await page.goto(TARGET_URL)
        await page.type(ID_INPUT, ID)
        await page.type(PASSWORD_INPUT, PASSWORD)
        await page.click(LOGIN)
        await page.waitForNavigation({
            waitUntil: 'load'
        })
        // 进入课程中心
        // await page.click('a[ui-sref=courseCenter]')
        // await page.waitForNavigation({
        //     waitUntil: 'load'
        // })
        // 进入个人中心
        await page.click('a[ui-sref=personalCenter]')
        await page.waitForNavigation({
            waitUntil: 'load'
        })
        // .tab-panel > .list:nth(5) > .list0-75
        // 查找指定播放项
        const playList = await page.$$('.tab-panel .list')
        console.log(playList.length)
        await playList[5].click('.list0-75')
        await page.waitForNavigation({
            waitUntil: 'load'
        })

        // 拖动滑块
        const dragWrapperWidth = await page.$eval('.drag_text', el => el.clientWidth)
        const slider = await page.$('.handler')
        const handle = await slider.boundingBox()
        await page.mouse.move(handle.x, handle.y + slider.height / 2)
        await page.mouse.down()
        await page.mouse.move(handle.x + dragWrapperWidth, handle.y + slider.height / 2)
        await page.mouse.up()

        // 获取时长
        const totalTimeText = await page.$eval('.myplayer_controlbar_duration', el => el.innerHTML)
        const elapsedTimeText = await page.$eval('.myplayer_controlbar_elapsed', el => el.innerHTML)

        const totalVideoTime =  transformTimestamp(totalTimeText) + 10
        const elapsedVideoTime =  transformTimestamp(elapsedTimeText) + 10

        const waitTime = totalVideoTime - elapsedVideoTime

        console.log(waitTime)
        await page.waitForTimeout(waitTime * 1000)

        await page.close()




        // await browser.close()
    }catch(err) {
        console.log("err --->>>", err)
        await browser.close()
    }
}

module.exports = autoPlay