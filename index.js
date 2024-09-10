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
    // const auth = new google.auth.GoogleAuth({
    //     keyFile: 'scraping-sheets-434807-eea03b997e41.json',
    //     scopes: 'https://www.googleapis.com/auth/spreadsheets',
    // });
    const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: "scraping-spreadsheet@scraping-sheets-434807.iam.gserviceaccount.com",
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC0u313LEihYl95\n9dC0VMPcMGGC2nXee/hHqCKOEGvJzSwKnzbsvSr08x6aSKW2o86cPZMaV8wSnIPO\nNrDokSjwYEZZFfQNLYdnxJOmslTN9VugCKcoNAXbdOfFnzgy1ETp4IvX95WHZNpp\nvLWqGq2Vw1sO/5VIFBtyZiTFjoMducPwO4zw5M7NO5VobbD0Xxbsun3YWsKTB4Fr\noRBjHNBQNZqoUGHk+nZHFJHtCPQYsDdMFxJWcUOyVM/XkjFtT0Nzdv7rpCtjgMjE\nLcaP/riPs+F+880+5keIfp+qUjBXoSGw1VBp+qqW2pZamI+JgjSu581aP0FQbHlb\nFE0xpmPfAgMBAAECggEAAmLfJ35V/WZIJkej7oeISD0KBI0x4biuuYbACFmDH6n8\nkPNll98q2sU8Auppc+Lr0RwhIqx+10LqKFmAmUWbMPc6BZT/+CjBBJJfTZoulk7z\n311GIBXt72InQqMOdEZw3i+k3OkY8ky0VGMI7Vw6LRI5jiWcATGy49xAcuqh0w83\nv9e6SJKG0AJP6i2ZyJXRa3LCKFi8hfGRN5ktIyrYyOvwpVYJThGhwEb+BZtbsaD+\nNXyiSIj6pnsWTL+XUAhYn+x/3UHhjVlkVXJxPRXUVbrVL6/O7hy+TMDEwDszpa+M\n5eUqMnNOxnylm2xTZXAxLiBS+0bd3/niOqmbk4iWuQKBgQDsSnPNChyAoQyqj3kQ\nkMbhfKRO1kLsjcY3ks5kL46GhGI7m7iguoxGXtoO9jn1Qc056G90Iq2+oImo0LL7\nhVTtwoRTbwJf4HvLc8jxr15I6IjGiHVthqk7BkVD3wJ6Hb6ASBRgMTJrrpuPf2Ib\nG604Lkunlrmd9oVZSkFYZlViZwKBgQDDzrD4xhoO6EP4+IEg9+QgI135MbZb3BYh\nlYU9wlZqyQrrF0HFdwEAp8tqILP+HNCK10laW0SYyYDVCLA0j4YhDoErQHFJRrw/\nxbDGjBTkbA9Oads85kTTTDE6+OQ+phClpwarkA7f+dvw9KrK9ddLtNTkl4imfsW6\nHc8rYMg3yQKBgQCCCbtPFQh4lakl2I2U20hIYdL+/BWan699eBKTukRirUpuaZWj\nBucZ9ytkXoeo/MyX2N41eLxLk4gO2sQVfdwueQVf8VDKOP2ICzGEKLHnx+k18XVG\nkHxj2mCWKI3xbJsheAmWopyP/GjqAP2Z05Jxv7CtC1sdnsTmTeJGZxMIcwKBgQCF\n2D2Eb/XUBtSf1U5/OLPJfCN6eY7Lz++Y2VoQ00y7Bd3ewTEGR8h5qDkVvHEM3Kl4\nnpzXlNeZEPRtqti3tPvckMuewxgtHJsFhJ7HuW12jp8P3LAuOsEFJmnog8WRRXbP\npRKcJ4bjdynu1XAB+HZIm72C3EpedP23sTSx1CBIcQKBgE6dRwyM7h4H2KX867mT\nvSqTojtjD6hPFmf27eGmHYfU2gK8no1AXq1v3+E/SU2ZrP6GI7HBp5NdJPw7U2Tc\n0uxthouG419s9UihM44j1i3QICan0Jt5ekn50QGeKNGU/C7rKmJDyK/2PM1nBB6j\nP/TwGWX34pQhQudjBBi4JAkb\n-----END PRIVATE KEY-----\n"
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
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
