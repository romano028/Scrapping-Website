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

// Define root route
app.get('/', (req, res) => {
    res.send('Welcome to the Scraping API!');
});

// Define /scrap route with specific CORS handling
app.get('/scrap', corsForRoute, async (req, res) => {
    let options = {};

    if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
        options = {
            args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
            defaultViewport: chrome.defaultViewport,
            executablePath: await chrome.executablePath,
            headless: true,
            ignoreHTTPSErrors: true,
        };
    }

    try {
        let browser = await puppeteer.launch(options);

        let page = await browser.newPage();
        await page.goto("https://www.google.com");
        const title = await page.title();
        await browser.close(); // Close the browser

        res.send(title);
    } catch (error) {
        console.error("Error occurred:", error); // Log the error
        res.status(500).send("An error occurred");
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
