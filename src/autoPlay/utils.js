const randomScope = (mix = 500, max = 1000) => {
    const diff = max - mix
    const random = mix + Math.floor(Math.random() * diff)
    return random
}
const sleep = (time = randomScope()) => new Promise(resolve => setTimeout(resolve, time))


module.exports = {
    sleep
}