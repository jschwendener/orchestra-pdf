const fs = require('fs')
const archiver = require('archiver')

const outputPath = './dist/orchestra-pdf.zip'
const filesToPack = [
    '.ebextensions',
    '.npmrc',
    'index.js',
    'package-lock.json',
    'package.json',
    'pdf.js',
]

// Make sure dist folder exists
if (!fs.existsSync('./dist')) {
    fs.mkdirSync('./dist')
}

// Delete existing package
if (fs.existsSync(outputPath)) {
    fs.unlinkSync(outputPath)
}

// Create output stream and archive
const output = fs.createWriteStream(outputPath)
const archive = archiver('zip', {
    gzip: true,
    zlib: { level: 9 }
})

// Error handling
archive.on('error', err => {
    throw err
})

// Package files into archive
archive.pipe(output)
console.log('📦  Start packing up files')
filesToPack.forEach(file => {
    archive.file('./' + file, { name: file })
    console.log(`--- ${file}`)
})

archive.finalize()
console.log('✅  Finished!')