module.exports = (router, config) => {

  router.all(`${config.urlPath}/:view`, (req, res) => {
    console.log(req.params.view)
    res.render(`${config.filePath}/${req.params.view}`, config.locals)
  })

  return router
}