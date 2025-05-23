const express = require('express');
const puppeteer = require('puppeteer');
const TurndownService = require('turndown');

const app = express();
app.use(express.json());

app.post('/scrape', async (req, res) => {
  const { url } = req.body;

  if (!url || !/^https?:\/\//.test(url)) {
    return res.status(400).json({ error: 'Valid URL required (http/https).' });
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    const html = await page.content();
    const turndownService = new TurndownService();
    const markdown = turndownService.turndown(html);

    await browser.close();

    res.json({ markdown });
  } catch (err) {
    console.error('[SCRAPE ERROR]', err.message);
    res.status(500).json({ error: 'Scraping failed: ' + err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Web → Markdown Scraper is up. POST to /scrape with { url }.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
