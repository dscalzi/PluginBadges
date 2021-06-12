/**
 * Copyright (c) 2019-2020 Daniel D. Scalzi
 * 
 * Licensed under the MIT license (see LICENSE.txt for details).
 */
require('dotenv').config()

const { makeBadge } = require('badge-maker')
// const cloudscraper = require('cloudscraper')
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

// function _doParse(body, regex){
//     const m = body.match(regex)
//     if(m == null || m.length < 2){
//         return 0
//     } else {
//         return Number.parseInt(m[1].replace(',', ''))
//     }
// }

// function _webCrawlParse(base, id, regex, cloudflare = false){

//     return new Promise((resolve, reject) => {
//         if(isNull(id)){
//             resolve(0)
//         } else {
//             const url = `${base}/${id}/`
//             if(cloudflare){
//                 try {
//                     cloudscraper.get(url, (err, resp, body) => {
//                         if(err){
//                             //reject(err)
//                             console.error(`Cloudflare Request error for ${url}. Not caching result..`, err)
//                             // -1 indicates error (do not cache if cloudflare error)
//                             // usually resolved by sending another request.
//                             resolve(-1)
//                         } else {
//                             resolve(_doParse(body, regex))
//                         }
//                     })
//                 } catch(error) {
//                     resolve(0)
//                 }
//             } else {
//                 request(url, (err, resp, body) => {
//                     if(err){
//                         //reject(err)
//                         console.error(`Request error for ${url}`, err)
//                         resolve(0)
//                     } else {
//                         resolve(_doParse(body, regex))
//                     }
//                 })
//             }
//         }
//     })

// }

function parseBukkit(id){
    return 0
    // return _webCrawlParse('https://dev.bukkit.org/projects', id, /<div class="info-label">Total Downloads<\/div>\s*<div class="info-data">(.+)<\/div>/, true)
}

function parseSpigot(id){
    return new Promise((resolve, reject) => {
        if(isNull(id)){
            resolve(0)
        } else {

            let longId
            try {
                longId = id.substring(id.lastIndexOf('.')+1)
            } catch(error) {
                resolve(0)
                return
            }

            const url = `https://api.spigotmc.org/simple/0.1/index.php?action=getResource&id=${longId}`
            request(url, {
                headers: {
                    'User-Agent': 'PluginBadges'
                }
            }, (err, resp, body) => {
                if(err){
                    //reject(err)
                    console.error(`Request error for ${url}`, err)
                    resolve(0)
                } else {
                    resolve(JSON.parse(body).stats.downloads)
                }
            })
        }
    })
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

let GH_RATE_LIMIT = -1

function parseGH(id){
    return new Promise((resolve, reject) => {
        if(new Date().getTime() < GH_RATE_LIMIT){

            console.log('Github Rate Limited. Unable to serve request.')
            resolve(0)

        } else if(isNull(id)){

            resolve(0)

        } else {

            let url = `https://api.github.com/repos/${id}/releases`

            if(process.env.GH_CLIENT_ID != null && process.env.GH_CLIENT_SECRET != null){
                url += `?client_id=${process.env.GH_CLIENT_ID}&client_secret=${process.env.GH_CLIENT_SECRET}`
            }

            request({
                url,
                headers: {
                    'User-Agent': 'plugin-download-badge'
                }
            }, (err, resp, body) => {
                if(err){
                    console.error(`Request error for ${url}`, err)
                    resolve(0)
                } else {
                    if(resp.statusCode === 200){

                        body = JSON.parse(body)
                        let count = 0
                        for(let release of body){
                            for(let asset of release.assets){
                                count += asset.download_count
                            }
                        }

                        if(Number.parseInt(resp.headers['x-ratelimit-remaining']) === 0){
                            GH_RATE_LIMIT = Number.parseInt(resp.headers['x-ratelimit-reset'])*1000
                            console.log('Github Rate Limit Exceeded. Resets at', new Date(GH_RATE_LIMIT))
                        }

                        resolve(count)

                    } else {
                        resolve(0)
                    }
                }
            })
        }
    })
}

app.get(/\/api\/v1\/dl\/(.*)-(.*).svg/, async (req, res) => {

    let downloads = 0

    const cKey = crypto.createHash('md5').update([req.query.github, req.query.bukkit, req.query.spigot, req.query.ore].filter(Boolean).join('')).digest('hex')
    const cValue = cache.get(cKey)

    if(cValue != null){
        downloads = cValue
    } else {
        const values = [
            await parseBukkit(req.query.bukkit),
            await parseSpigot(req.query.spigot),
            await parseOre(req.query.ore),
            await parseGH(req.query.github)
        ]

        downloads = values.reduce((total, val) => total + Math.max(0, val), 0)
        const hasErrors = values.reduce((hasErrors, val) => hasErrors || val < 0, false)

        // Dont cache with errors.
        if(downloads > 0 && !hasErrors){
            cache.set(cKey, downloads)
        }
    }

    const format = {
        label: req.params[0],
        message: String(downloads),
        labelColor: req.query.labelColor || '#555',
        color: req.params[1] || 'limegreen',
        style: req.query.style || 'flat'
    }

    try {
        const svg = makeBadge(format)

        res.set('Cache-Control', `max-age=${maxAgeSeconds}`)
        res.type(mime.getType('svg')).status(200).send(svg)
    } catch(err) {
        res.status(400).send(err.message)
    }
    
    
})

const server = app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
})

module.exports = server