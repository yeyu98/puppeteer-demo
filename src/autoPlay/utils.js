const randomScope = (mix = 500, max = 1000) => {
    const diff = max - mix
    const random = mix + Math.floor(Math.random() * diff)
    return random
}
const sleep = (time = randomScope()) => new Promise(resolve => setTimeout(resolve, time))
const getNewPage = (browser) => new Promise(resolve => browser.once("targetcreated", target => resolve(target.page())))
const convertSeconds = (time) => {
    const [hour, minute, second] = time
    let seconds = 0
    if(hour) seconds += hour * 3600
    if(minute) seconds += minute * 60
    if(second) seconds += second
    return seconds
}

module.exports = {
    sleep,
    getNewPage,
    convertSeconds
}