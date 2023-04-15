const puppeteer = require('puppeteer')
const fs = require('fs')
const generateJsonFile = (result) => {
    const data = JSON.stringify(result)
    fs.writeFile('./files/movies.json', data, err => {
        if(err) {
            console.log('err --->>>', err)
            throw err;
        }
    })
    
}
export const getDouBanMovie = async () => {
    const browser = await puppeteer.launch({
        headless: true,
        timeout: 50000
    })
    const page = await browser.newPage()
    await page.goto('https://movie.douban.com/cinema/nowplaying/beijing/')
    const result = await page.evaluate(() => {
        console.log('电影信息给爷爬！')
        const movies = document.querySelectorAll('#nowplaying > div.mod-bd > ul > li')
        const links = []
        if(movies?.length > 1) {
            movies.forEach((item, index) => {
                const data = [...item.attributes]
                const link = {attrs: {}}
                data.forEach(v => {
                    link.attrs[v.nodeName] = v.value
                })
                const img = document.querySelectorAll('.poster > a > img')[index]
                link.src = img.src
                const title = document.querySelectorAll('.stitle > a')[index]
                link.title = title.title
                const star = document.querySelectorAll('.srating > .subject-rate')[index]
                link.star = star?.innerText || 0
                links.push(link)
            })
        }
        return links
    })
    generateJsonFile(result)
    await browser.close()
}
