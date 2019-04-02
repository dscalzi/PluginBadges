/**
 * Copyright (c) 2019 Daniel D. Scalzi
 * 
 * Licensed under the MIT license (see LICENSE.txt for details).
 */

const { BadgeFactory } = require('gh-badges')
const cloudscraper = require('cloudscraper')
const crypto = require('crypto')
const express = require('express')
const LRU = require('lru-cache')
const mime = require('mime')
const path = require('path')
const request = require('request')

const maxAgeSeconds = 3600

const cache = new LRU({
    max: 5000,
    maxAge: maxAgeSeconds * 1000
})

const app = express()
const port = '8080'

app.use(express.static('public'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/uikit/js/uikit.min.js', function (req, res) {
    res.sendFile(path.join(__dirname, '/node_modules/uikit/dist/js/uikit.min.js'))
})
app.get('/uikit/js/uikit-icons.min.js', function (req, res) {
    res.sendFile(path.join(__dirname, '/node_modules/uikit/dist/js/uikit-icons.min.js'))
})
app.get('/uikit/css/uikit.min.css', function (req, res) {
    res.sendFile(path.join(__dirname, '/node_modules/uikit/dist/css/uikit.min.css'))
})

app.get('/jquery/jquery.min.css', function (req, res) {
    res.sendFile(path.join(__dirname, '/node_modules/jquery/dist/jquery.min.js'))
})

function isNull(param){
    return param == null || !param || param === 'null' || param === 'undefined'
}

function _doParse(body, regex){
    const m = body.match(regex)
    if(m == null || m.length < 2){
        return 0
    } else {
        return Number.parseInt(m[1].replace(',', ''))
    }
}

function _webCrawlParse(base, id, regex, cloudflare = false){

    return new Promise((resolve, reject) => {
        if(isNull(id)){
            resolve(0)
        } else {
            const url = `${base}/${id}/`
            if(cloudflare){
                cloudscraper.get(url, (err, resp, body) => {
                    if(err){
                        //reject(err)
                        console.error(`Request error for ${url}`, err)
                        resolve(0)
                    } else {
                        resolve(_doParse(body, regex))
                    }
                })
            } else {
                request(url, (err, resp, body) => {
                    if(err){
                        //reject(err)
                        console.error(`Request error for ${url}`, err)
                        resolve(0)
                    } else {
                        resolve(_doParse(body, regex))
                    }
                })
            }
        }
    })

}

function parseBukkit(id){
    return _webCrawlParse('https://dev.bukkit.org/projects', id, /<div class="info-label">Total Downloads<\/div>\s*<div class="info-data">(.+)<\/div>/)
}

function parseSpigot(id){
    return _webCrawlParse('https://www.spigotmc.org/resources', id, /<dl class="downloadCount">[\s\S]*?<dd>(.+)<\/dd>[\s\S]*?<\/dl>/, true)
}

function parseOre(id){
    return new Promise((resolve, reject) => {
        if(isNull(id)){
            resolve(0)
        } else {
            const url = `https://ore.spongepowered.org/api/v1/projects/${id.toLowerCase()}`
            request(url, (err, resp, body) => {
                if(err){
                    //reject(err)
                    console.error(`Request error for ${url}`, err)
                    resolve(0)
                } else {
                    resolve(JSON.parse(body).downloads)
                }
            })
        }
    })
}

function parseGH(id){
    return new Promise((resolve, reject) => {
        if(isNull(id)){
            resolve(0)
        } else {
            const url = `https://api.github.com/repos/${id}/releases`
            request({
                url,
                headers: {
                    'User-Agent': 'plugin-download-badge'
                }
            }, (err, resp, body) => {
                if(err){
                    //reject(err)
                    console.error(`Request error for ${url}`, err)
                    resolve(0)
                } else {
                    body = JSON.parse(body)
                    let count = 0
                    for(let release of body){
                        for(let asset of release.assets){
                            count += asset.download_count
                        }
                    }
                    resolve(count)
                }
            })
        }
    })
}

app.get('/api/v1/dl/:name-:color.svg', async (req, res) => {
    const gh = isNull(req.query.ghuser) || isNull(req.query.ghrepo) ? null : `${req.query.ghuser}/${req.query.ghrepo}`

    let downloads = 0

    const cKey = crypto.createHash('md5').update([gh, req.query.bukkit, req.query.spigot, req.query.ore].filter(Boolean).join('')).digest('hex')
    const cValue = cache.get(cKey)

    if(cValue != null){
        downloads = cValue
    } else {
        const bukkitDL = await parseBukkit(req.query.bukkit)
        const spigotDL = await parseSpigot(req.query.spigot)
        const oreDL = await parseOre(req.query.ore)
        const ghDL = await parseGH(gh)
        downloads =  bukkitDL+spigotDL+oreDL+ghDL

        if(downloads > 0){
            cache.set(cKey, downloads)
        }
    }

    const bf = new BadgeFactory()

    const format = {
        text: [req.params.name || 'Downloads', downloads],
        color: req.params.color || 'limegreen',
        template: req.query.style || 'flat',
        labelColor: req.query.labelColor || '#555',
        logo: req.query.logo,
        links : ['https://github.com/dscalzi/PluginBadges/', '']
    }

    const svg = bf.create(format)

    res.set('Cache-Control', `max-age=${maxAgeSeconds}`)
    res.type(mime.getType('svg')).status(200).send(svg)
    
})

const server = app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
})

module.exports = server