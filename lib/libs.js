const getToday = async () => {
    let today = new Date()
    let dd = today.getDate()
    if(dd < 10) {
        dd = '0' + dd
    }
    let mm = today.getMonth() + 1
    if(mm < 10) {
        mm = '0' + mm
    }
    let yyyy = today.getFullYear()
    today = `${yyyy}-${mm}-${dd}`
    return today
}

module.exports = {
    getToday
}