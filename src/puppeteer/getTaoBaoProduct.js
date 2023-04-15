const puppeteer = require('puppeteer')

const getProductInfo = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        timeout: 50000
    })
    const page = await browser.newPage()
    await page.goto('https://login.taobao.com/member/login.jhtml?spm=a21bo.jianhua.754894437.1.707e11d9ikHMWM&f=top&redirectURL=https%3A%2F%2Fwww.taobao.com%2F%3Fspm%3Da1z02.1.1581860521.1.HhZ3MD')
    await page.waitForSelector('#container')

    await page.type('#fm-login-id', '18160716527');    
    await page.type('#fm-login-password', 'yi.2693483');
    await page.click('.password-login')
    await page.waitForNavigation({
        waitUntil: 'load'
    })


    // await page.goto(`https://www.taobao.com/?spm=a1z02.1.1581860521.1.HhZ3MD`)
    // await page.waitForSelector('.tb-recommend-content')
    const result = await page.evaluate(() => {
        const items = document.querySelectorAll('.tb-recommend-content > .tb-recommend-content-item > a')
        const links = []
        if(items?.length > 1) {
            items.forEach((item, index) => {
                const img = item.querySelector('.img-wrapper > img')
                const title = item.querySelector('.info-wrapper > .title')
                const tags = item.querySelectorAll('.tag-list > .tag-item')
                const tagList = []
                tags.forEach(item => tagList.push(item.innerText))
                
                links.push({
                    imgSrc: img.src,
                    title: title.innerText,
                    tagList
                })
            })
            return links
        }
        return null
    })
    console.log(result)
    await browser.close()
    return result
}


module.exports = getProductInfo