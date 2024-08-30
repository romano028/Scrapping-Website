const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
var bodyParser = require('body-parser');  
const app = express();
const port = 3000;
var urlencodedParser = bodyParser.urlencoded({ extended: false })  
// app.use(cors());
// app.use(express.bodyParser());
app.post('/scrap',urlencodedParser , async (req, res) => {

    /*  const url = req.body.url;
        try {
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
            const page = await browser.newPage();
          

            // Set initial User-Agent for non-image requests
            await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36');
            await page.evaluateOnNewDocument(() => {
                Intl.DateTimeFormat().resolvedOptions().timeZone = 'Asia/Manila';
            });
    
            // Intercept requests to modify User-Agent for images
            await page.setRequestInterception(true);
            page.on('request', (request) => {
                if (request.resourceType() === 'image') {
                    // Continue without modifying the User-Agent for image requests
                    request.continue();
                } else {
                    request.continue();
                }
            });
    
            // Navigate to the page
            await page.goto(url, {
                timeout: 30000, // Increased timeout for slow-loading pages
                waitUntil: 'networkidle2', // Ensure the page is fully loaded
            });
    
            // Wait for product tiles to appear
            // await page.waitForSelector('div[data-testid="productTile"]', { visible: true });
    
            // Scroll down to trigger lazy-loaded images
            await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });
    
            // Wait for images to load
            await page.evaluate(async () => {
                const images = Array.from(document.querySelectorAll('img'));
                await Promise.all(images.map(img => {
                    if (img.complete) return;
                    return new Promise((resolve) => {
                        img.onload = resolve;
                        img.onerror = resolve;
                    });
                }));
            });
            const htmlContent = await page.content();
            // Extract product data
         

       
            res.status(200).json([htmlContent]);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'An error occured while scraping the page.'});
        }
 */
        res.status(200).json(["htmlContent"]);
    
});
app.get("/greet", (req, res) => {
    // get the passed query
    const { name } = req.query;
    res.send({ msg: `Welcome ${name}!` });
});
app.get("/", (req, res) => {
    res.send("Express on Vercel");
  });
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
