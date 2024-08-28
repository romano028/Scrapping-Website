const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors'); // Import cors

const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/scrape', async (req, res) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://stockx.com/');
        const title = await page.title();
        await browser.close();

        res.json({ success: true, title });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
