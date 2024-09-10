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
    origin: 'http://scraper-test.test',
    methods: ['POST', 'GET'], // Allow GET for the /data endpoint
    allowedHeaders: ['Content-Type'],
    credentials: true
}));
 
app.post("/scrape",urlencodedParser , (req, res) => {
  scrapeLogic(req , res);
  // res.send("Render Puppeteer ");
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
