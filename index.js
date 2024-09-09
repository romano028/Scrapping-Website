const express = require("express");
const { scrapeLogic } = require("./scrapeLogic");
const app = express();
var bodyParser = require('body-parser');  
var urlencodedParser = bodyParser.urlencoded({ extended: false })  

const PORT = process.env.PORT || 10000;
 
app.post("/scrape",urlencodedParser , (req, res) => {
  scrapeLogic(req , res);
  // res.send("Render Puppeteer ");
});

app.get("/", (req, res) => {
  res.send("Render Puppeteer server is up and running!");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
