const puppeteer = require('puppeteer')
const fs = require('fs')
const axios = require('axios')
const { generateFileName } = require('../utils')

const save = async (ext = 'jpg') => {
    try {
        const data = await getAllUrl(1)
        if(data?.length > 1)  {
            data.forEach((item, index) => {
                axios({
                    method: 'get',
                    url: item,
                    responseType: 'stream',
                    timeout: 50000
                }).then(res => {
                    console.log('图片下载中...')
                    const file = fs.createWriteStream(`../files/test/${generateFileName()}.${ext}`) // 
                    res.data.pipe(file)
                    file.on('error', (err) => {
                        console.log('err --->>>', err)
                    })
                }) 
            })
        }
        return null
    } catch(err) {
        console.log('err --->>>', err)
    }
}

const getUrl = async (currentPage=1, tag='性感') => {
    const browser = await puppeteer.launch({
        headless: true,
        timeout: 50000
    })
    const page = await browser.newPage()
    await page.goto(`https://m.bcoderss.com/page/${currentPage}/?s=${encodeURIComponent(tag)}`) // 进入图片网站
    console.log(`正在加载第${currentPage}页...`)
    await page.waitForSelector('#main') // 等待main元素加载完成
    console.log(`第${currentPage}页加载完成...`)
    const result = await page.evaluate(() => { // 相当于
        const wallpapers = document.querySelectorAll('.wallpaper > li > a > img')
        const links = [] // 图片链接列表
        if(wallpapers?.length > 1) {
            wallpapers.forEach(item => {
                links.push(item.src)
            })
            return links
        }
        return null
    })
    console.log(`第${currentPage}页图片地址获取完成...`)
    await browser.close()
    return result
}

const getAllUrl = async(totalPage = 1) => {
    let totalResult = []
    let currentPage = 1
    while(currentPage !== totalPage) {
        const result = await getUrl(currentPage++)
        totalResult = [...totalResult, ...result]
    }
    console.log(totalResult.length)
    return totalResult
}

module.exports = save