const express = require('express')
const bodyParser = require('body-parser')
const PDF = require('./pdf')
const app = express()

/**
 * Server port
 */
const port = process.env.PORT || 3010

/**
 * Comma seperated list of allowed IP addresses
 */
// const allowedOrigins = process.env.ALLOWED_ORIGINS || '::1,127.0.0.1'

// const AllowedOriginMiddleware = (req, res, next) => {
//     let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
//     const timestamp = new Date().toISOString()

//     if (ip.includes(',')) {
//         ip = ip.split(', ')[0]
//     }
    
//     if (!allowedOrigins.split(',').includes(ip)) {
//         // console.log(`[${timestamp}] Blocking IP: ${ip}`)
//         res.send({ notice: 'Forbidden ' + ip })
//         return
//     }

//     console.log(`[${timestamp}] Allowing IP: ${ip}`)
//     next()
// }

// app.use(AllowedOriginMiddleware)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/**
 * PDF generation route
 */
app.get('/', (req, res) => {
    const url = req.query.url
    const title = req.query.title

    if (!url) {
        res.status(200).send({ version: 1.0 })
        return
    }

    PDF.generate(url, title).then(file => {
        res.set({ 
            'Content-Type': 'application/pdf',
            'Content-Length': file.length,
            'Content-Disposition': `inline; filename="${title || 'file'}.pdf"`
        }).send(file)
    }).catch(err => {
        res.status(500).send({ error: err.message })
    })
})

app.post('/', (req, res) => {
    const title = req.body.title
    const contents = req.body.contents

    if (!contents) {
        res.status(422).send({ error: 'Missing parameter contents' })
        return
    }

    PDF.generate(null, title, contents).then(file => {
        res.set({ 
            'Content-Type': 'application/pdf',
            'Content-Length': file.length,
            'Content-Disposition': `inline; filename="${title || 'file'}.pdf"`
        }).send(file)
    }).catch(err => {
        res.status(500).send({ error: err.message })
    })
})

/**
 * Start server
 */
app.listen(port, () => {
    console.log(`App listening now on port ${port}`)
})