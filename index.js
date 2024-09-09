const express = require("express");
const { scrapeLogic } = require("./scrapeLogic");
const app = express();
const fs = require('fs');
var bodyParser = require('body-parser');  
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const cors = require('cors');
const {google} = require('googleapis');
const path = require('path');

const PORT = process.env.PORT || 10000;

app.use(cors({
    origin: 'http://192.168.50.13',
    methods: ['POST', 'GET'], // Allow GET for the /data endpoint
    allowedHeaders: ['Content-Type'],
    credentials: true
}));
 
// app.post("/scrape",urlencodedParser , (req, res) => {
//   scrapeLogic(req , res);
//   // res.send("Render Puppeteer ");
// });
app.post('/scrape', urlencodedParser, async (req, res) => {
    const isValidURL = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
    
    const url = req.body.url;

    if (!url || !isValidURL(url)) {
        return res.status(400).json({error: 'Invalid URL'});
    }

    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36');
        await page.evaluateOnNewDocument(() => {
            Intl.DateTimeFormat().resolvedOptions().timeZone = 'Asia/Manila';
        });

        await page.setRequestInterception(true);
        page.on('request', (request) => {
            request.continue();
        });

        await page.goto(url, {
            timeout: 50000,
            waitUntil: 'networkidle2',
        });

        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });

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
        res.status(200).json([htmlContent]);
    } catch (error) {
        console.error('Server Error:', error); // Detailed server log
        res.status(500).json({ error: 'An error occurred while scraping the page.' });
    }
});


app.post('/sheet', async (req, res) => {
    const auth = new google.auth.GoogleAuth({
        keyFile: 'scraping-sheets-434807-eea03b997e41.json',
        scopes: 'https://www.googleapis.com/auth/spreadsheets',
    });

    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: 'v4', auth: client });
    const data = req.body;
    const spreadsheetId = '12T0ksWsKCRdEKJgMY_ehi7PlOHJr67P0OyJMaLTm89k';

    try {
        const getRows = await googleSheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'Sheet1!A1:A1',
        });

        if (getRows.data.values === undefined || getRows.data.values.length === 0) {
            await googleSheets.spreadsheets.values.update({
                spreadsheetId,
                range:'Sheet1!A1:F1',
                valueInputOption: 'RAW',
                resource: {
                    values:[
                        [
                            'Brand', 'Price', 'URL', 'Style', 'Description', 'Variations'
                        ]
                    ]
                }
            })
        }

        const response = await googleSheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Sheet1', //Adjust the range as needed
            valueInputOption: 'RAW',
            resource: {
                values: [
                    [
                        data.brand,
                        data.price,
                        data.url,
                        data.style,
                        data.description,
                        data.variations
                    ]
                ],
            },
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error writing to Google Sheets:', error);
        res.status(500).json({ error: 'Error writing to Google Sheets' });
    }
});

app.get("/", (req, res) => {
  res.send("Render Puppeteer server is up and running!");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
