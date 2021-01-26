const baseUrl = '../static/'

exports.indexAPI = (req, res) => {
    console.log(req.session)
    console.log(req.session.passport)
    res.render(baseUrl + 'index.html')
}

exports.successAPI = (req, res) => {
    res.render(baseUrl + 'success.html')
}
exports.failedAPI = (req, res) => {
    res.render(baseUrl + 'failed.html')
}