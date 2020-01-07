const puppeteer = require('puppeteer')

/**
 * Starts a headless chrome instance to 
 * generate a PDF of the given URL.
 * 
 * @param {string} url URL to generate a PDF from
 */
async function generate(url = null, title = '', contents = null) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    if (url) {
        await page.goto(url, { waitUntil: 'networkidle0' })
    } else if (contents) {
        await page.setContent(contents, { waitUntil: 'networkidle0' })
    }

    const defaultHeaderFooterStyles = `display: flex; justify-content: space-between; width: 100%; margin: 0 42px; font-size: 8px; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji';`
    const pdf = await page.pdf({
        format: 'A4',
        margin: {
            top: 80,
            bottom: 80
        },
        displayHeaderFooter: true,
        headerTemplate: `
            <div style="${defaultHeaderFooterStyles}">
                <div>${title}</div>
                <div></div>
            </div>
        `,
        footerTemplate: `
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