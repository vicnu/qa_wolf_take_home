const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  try {
    // launch browser
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // go to Hacker News
    await page.goto("https://news.ycombinator.com/newest");

    // Extract the timestamps of the first 100 articles
    const articles = await page.$$eval('.athing', articles => {
      return articles.slice(0, 100).map(article => {
        const subtext = article.nextElementSibling.querySelector('.subtext');
        const timeElement = subtext.querySelector('.age');
        return timeElement.getAttribute('title');
      });
    });

    // Convert timestamps to Date objects for comparison
    const articleDates = articles.map(date => new Date(date));

    // Check if the articles are sorted from newest to oldest
    let sorted = true;
    for (let i = 0; i < articleDates.length - 1; i++) {
      if (articleDates[i] < articleDates[i + 1]) {
        sorted = false;
        break;
      }
    }

    if (sorted) {
      console.log("The first 100 articles are sorted from newest to oldest.");
    } else {
      console.log("The first 100 articles are NOT sorted from newest to oldest.");
    }

    await browser.close();
  } catch (error) {
    console.error("Error launching browser:", error);
  }
}

(async () => {
  await sortHackerNewsArticles();
})();
