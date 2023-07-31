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

        locals = { 
            ...locals, 
            ...{ 
                prototypeVersion: directory,
                prototypeAssets: `${directory}/assets`
            } 
        }
        
        // Optional prototype assets
        if (fs.existsSync(`${currentFilePath}/assets`)) {
            govukPrototypeKit.requests.serveDirectory(`/${directory}/assets`, `${currentFilePath}/assets`)
        }
        
        // load a prototype specific routes file to override what follows if needed
        const prototype = require(`${currentFilePath}/support/router.js`)(router, { 
            urlPath: `/${directory}`, 
            filePath: currentFilePath,
            locals:  locals
        })

        // render index template when ending a slash
        router.all([`/${directory}/`, `/${directory}`], (req, res) => {
            res.redirect(`/${directory}/index`)
        })

        // match url to a template file
        router.all(`/${directory}/:view`, (req, res, next) => {
            res.render(`${currentFilePath}/${req.params.view}`, locals)
        })


        // this is quick and very dirty just to get sam and martin up and running
        router.all(`/${directory}/:subdir/:view`, (req, res, next) => {
            if (req.params.subdir == 'assets') {
                next()
            } else {
                res.render(`${currentFilePath}/${req.params.subdir}/${req.params.view}`, locals)
            }
        })
        
        // this is quick and very dirty just to get sam and martin up and running
        router.all(`/${directory}/:subdir/:subsubdir/:view`, (req, res, next) => {
            if (req.params.subdir == 'assets') {
                next()
            } else {
                res.render(`${currentFilePath}/${req.params.subdir}/${req.params.subsubdir}/${req.params.view}`, locals)
            }
        })

    }

    return router

}
