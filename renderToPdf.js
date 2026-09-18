const { pathToFileURL } = require('node:url');
const puppeteer = require('puppeteer');

async function renderToPdf(inputHtmlFile) {
    if (typeof inputHtmlFile !== 'string' || inputHtmlFile.length === 0) {
        throw new TypeError('An HTML file path is required.');
    }

    const outputPdfFile = inputHtmlFile.replace(/\.[^/.]+$/, '') + '.pdf';
    const browser = await puppeteer.launch();

    try {
        const page = await browser.newPage();
        await page.goto(pathToFileURL(inputHtmlFile).href, { waitUntil: 'networkidle0' });
        await page.pdf({
            path: outputPdfFile,
            printBackground: true,
            format: 'A4',
            margin: {
                left: '40px',
                right: '40px',
            },
        });
    } finally {
        await browser.close();
    }

    return outputPdfFile;
}

if (require.main === module) {
    renderToPdf(process.argv[2]).catch((error) => {
        console.error(error.message);
        process.exitCode = 1;
    });
}

module.exports = { renderToPdf };
