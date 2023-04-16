const puppeteer = require('puppeteer')

const mouseMove = async() => {
    // NOTE puppeteer中每个api都是异步的！！！
    const browser = await puppeteer.launch({headless: false})
    try {

        const page = await browser.newPage()
        await page.setViewport({
            width: 1920,
            height: 1000
        })
        await page.goto('https://www.jq22.com/yanshi23642')
        await page.waitForSelector('#iframe')
        const frames = await page.frames()
        // frame可能有很多个，这里需要查找指定的iframe
        const frame = frames.find(f => f.name() === 'iframe')
        // frame对象里也有很多api和page的是类似的
        await frame.waitForSelector('.slider-btn')
        const slider = await frame.$('.slider-btn')
        const silderBoxWidth = await frame.$eval('.slider-item', el => el.clientWidth)
        const handle = await slider.boundingBox()
        await frame.page().mouse.move(handle.x, handle.y + handle.height / 2)
        await frame.page().mouse.down()
        // NOTE 这个移动距离到底是怎么计算的
        // 移动的距离等于鼠标移动的距离
        await frame.page().mouse.move(handle.x + silderBoxWidth, handle.y + handle.height / 2, {steps: 100 })
        await frame.page().mouse.up()
    }catch(err) {
        console.log(err)
    }
}

module.exports = mouseMove