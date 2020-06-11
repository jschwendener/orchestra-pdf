const puppeteer = require('puppeteer')

/**
 * Starts a headless chrome instance to 
 * generate a PDF of the given URL.
 * 
 * @param {string} url URL to generate a PDF from
 */
async function generate(url = null, contents = null, options = {}) {
    const title = options.title || ''
    const header = options.header || ''
    const footer = options.footer || ''

    const browser = await puppeteer.launch({
        headless: true, 
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = await browser.newPage()

    if (url) {
        await page.goto(url, { waitUntil: 'networkidle0' })
    } else if (contents) {
        await page.setContent(contents, { waitUntil: 'networkidle0' })
    }

    const defaultHeaderFooterStyles = `display: flex; justify-content: space-between; width: 100%; margin: 0 50px; font-size: 8px; font-family: Archivo,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji';`
    const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
            top: options.marginTop || 180,
            bottom: options.marginBottom || 80,
            left: options.marginLeft || 100,
            right: options.marginRight || 100,
        },
        displayHeaderFooter: true,
        headerTemplate: header || `
            <div style="${defaultHeaderFooterStyles}">
                <div>${title}</div>
                <div></div>
            </div>
        `,
        footerTemplate: footer || `
            <div style="${defaultHeaderFooterStyles}">
                <div class="title"></div>
                <div><span class="pageNumber"></span>/<span class="totalPages"></span></div>
            </div>
        `,
    })

    await browser.close()
    return pdf
}

exports.generate = generate