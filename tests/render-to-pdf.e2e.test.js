const assert = require('node:assert/strict');
const { execFile } = require('node:child_process');
const { mkdtemp, readFile, writeFile } = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { promisify } = require('node:util');
const test = require('node:test');

const { renderToPdf } = require('../renderToPdf');

const execFileAsync = promisify(execFile);

async function createHtmlFile() {
    const directory = await mkdtemp(path.join(os.tmpdir(), 'convert-md-to-pdf-'));
    const inputPath = path.join(directory, 'document with spaces.html');
    await writeFile(inputPath, '<!doctype html><html><body><h1>Test PDF</h1></body></html>');
    return inputPath;
}

test('renders an HTML file to a PDF with Puppeteer', async () => {
    const inputPath = await createHtmlFile();

    const outputPath = await renderToPdf(inputPath);
    const pdf = await readFile(outputPath);

    assert.equal(outputPath, inputPath.replace(/\.[^/.]+$/, '.pdf'));
    assert.equal(pdf.subarray(0, 5).toString(), '%PDF-');
    assert.ok(pdf.length > 1000);
});

test('rejects a missing input path before launching the browser', async () => {
    await assert.rejects(
        () => renderToPdf(undefined),
        { name: 'TypeError', message: 'An HTML file path is required.' },
    );
});

test('reports a missing HTML file', async () => {
    const missingPath = path.join(os.tmpdir(), 'missing-render-input.html');

    await assert.rejects(
        () => renderToPdf(missingPath),
        /net::ERR_FILE_NOT_FOUND/,
    );
});

test('renders through the command-line interface', async () => {
    const inputPath = await createHtmlFile();

    await execFileAsync(process.execPath, [path.join(__dirname, '..', 'renderToPdf.js'), inputPath]);

    const pdf = await readFile(inputPath.replace(/\.[^/.]+$/, '.pdf'));
    assert.equal(pdf.subarray(0, 5).toString(), '%PDF-');
});

test('returns a command-line error when the input path is missing', async () => {
    await assert.rejects(
        () => execFileAsync(process.execPath, [path.join(__dirname, '..', 'renderToPdf.js')]),
        (error) => error.code === 1 && error.stderr.includes('An HTML file path is required.'),
    );
});
