const fs = require('fs')
const path = require('path')
const govukPrototypeKit = require('govuk-prototype-kit')

module.exports = (router, rootPath) => {

    // Find prototypes here
    const prototypesFilePath = `${rootPath}/views/prototypes/`

    const prototypes = fs.readdirSync(prototypesFilePath).filter(file => {
        return fs.statSync(`${prototypesFilePath}/${file}`).isDirectory()
    })

    // Multiple prototypes
    for (const directory of prototypes) {

        let locals = {}
        const currentFilePath = `${prototypesFilePath}${directory}`

        // Optional prototype locals
        if (fs.existsSync(`${currentFilePath}/support/locals.js`)) {
            locals = require(`${currentFilePath}/support/locals.js`)
        }

        console.log(locals)

        // const prototype = require(`${currentFilePath}/support/router.js`)(router, { 
        //     urlPath: `/${directory}`, 
        //     filePath: currentFilePath,
        //     locals:  { ...locals, ...{ prototypeVersion: directory } }
        // })
        
        // Optional prototype assets
        if (fs.existsSync(`${currentFilePath}/assets`)) {
            govukPrototypeKit.requests.serveDirectory(`/${directory}/assets`, `${currentFilePath}/assets`)
        }

        //remove all trailing slashes
        router.all('\\S+/$', (req, res) => {
            res.redirect(301, req.path.slice(0, -1) + req.url.slice(req.path.length))
        })

        // render index template when ending a slash
        router.all(`/${directory}/`, (req, res) => {
            res.render(`${currentFilePath}/index`, { ...locals, ...{ prototypeVersion: directory } })
        })

        // match url to a template file
        router.all(`/${directory}/:view`, (req, res) => {
            console.log(req.params.view)
            res.render(`${currentFilePath}/${req.params.view}`, { ...locals, ...{ prototypeVersion: directory } })
        })

    }

    return router

}
