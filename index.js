// For running htmljson.json
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

let chrome = {};
let puppeteer;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    chrome = require("chrome-aws-lambda");
    puppeteer = require("puppeteer-core");
} else {
    puppeteer = require("puppeteer");
}

// Middleware to set CORS headers for specific routes
const corsForRoute = cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
});

// Define routes with specific CORS handling
app.get('/scrap', corsForRoute, async (req, res) => {
    let options = {};

    if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
        options = {
            args: [...chrome.args, "--hide-scrolbars", "--disable-web-security"],
            defaultViewport: chrome.defaultViewport,
            executablePath: await chrome.executabablePath,
            headless: true,
            ignoreHTTPSErrors: true,
        };
    }

    try {
        let browser = await puppeteer.launch(options);

        let page = await browser.newPage();
        await page.goto("https//www.google.com");
        res.send(await page.title());
    } catch (error) {
        console.error(error);
        return null;
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

