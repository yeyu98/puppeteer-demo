const getCurrentDate = () => {
    const date = new Date()
    const year = date.getFullYear() + ''
    const month = date.getMonth() + 1 + ''
    const day = date.getDate() + ''
    const format = (v) => v.length === 1 ? `0${v}` : v 
    return {
        year,
        month: format(month),
        day:  format(day)
    }
}
const generateFileName = () => {
    const { year: y, month: m, day: d } = getCurrentDate();
    return `${Math.random().toString(36).substring(2)}_${y}${m}${d}`
}

module.exports = {
    getCurrentDate,
    generateFileName
}