const puppeteer = require('puppeteer');

(async () => {
    // Get the cmdline arguments
    const myArgs = process.argv.slice(2);
    // The first argument is the HTML file
    const inputHtmlFile = myArgs[0]
    // Extract the filename from input file, to create the output filename
    const outputHtmlFileName = inputHtmlFile.replace(/\.[^/.]+$/, "") + '.pdf'
    // Prepare the file path
    const filePath = 'file:///' + __dirname + '/' + inputHtmlFile

    // Launch the headless browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(filePath, { waitUntil: 'networkidle0' });
    await page.pdf({
        path: outputHtmlFileName,
        printBackground: true,
        format: 'A4',
        margin: {
            left: "40px",
            right: "40px",
        }
    });
    await browser.close();
})();