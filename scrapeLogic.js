const puppeteer = require("puppeteer");
require("dotenv").config();

const scrapeLogic = async (req , res) => {
 
  try {
    const url = req.body.url;
    // const url = "https://www.google.com";
    const browser = await puppeteer.launch({
      args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
       '--disable-dev-shm-usage',
       '--headless',
        // "--single-process",
        "--no-zygote",
      ],
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
    });

    //  let browser = await puppeteer.launch(options);

    let page = await browser.newPage();
    await page.setDefaultTimeout(600000);
    // await page.setDefaultNavigationTimeout(60000); 

    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36');
         
    await page.goto(url, { timeout: 60000, waitUntil: 'networkidle2' });

    const htmlContent = await page.content();
    // res.send(await page.title());
    res.status(200).json([htmlContent]);

    
   /*  const page = await browser.newPage();

    await page.goto("https://developer.chrome.com/");

    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 });

    // Type into search box
    await page.type(".search-box__input", "automate beyond recorder");

    // Wait and click on first result
    const searchResultSelector = ".search-box__link";
    await page.waitForSelector(searchResultSelector);
    await page.click(searchResultSelector);

    // Locate the full title with a unique string
    const textSelector = await page.waitForSelector(
      "text/Customize and automate"
    );
    const fullTitle = await textSelector.evaluate((el) => el.textContent);

    // Print the full title
    const logStatement = `The title of this blog post is ${fullTitle}`;
    console.log(logStatement);
    res.send(logStatement); */
  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  } finally {
    // await browser.close();
  }
};

module.exports = { scrapeLogic };
