module.exports = (router, { filePath, locals, urlPath }) => {

  router.all(`${urlPath}/blah`, (req, res) => {
    res.render(`${filePath}/cake`, locals)
  })

  return router
}