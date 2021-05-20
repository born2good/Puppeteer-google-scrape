const title = "Italy sites";
const puppeteerGoogleScraper = require("puppeteer-google-scraper");
const readline = require('readline');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: title + '5.csv',
    header: [
        {id: 'title', title: 'TITLE'},
        {id: 'url', title: 'URL'},
        {id: 'term', title:'TERM'}
    ]
});

const csvSocialWriter = createCsvWriter({
  path: title + '_social.csv',
  header: [
      {id: 'title', title: 'TITLE'},
      {id: 'url', title: 'URL'},
      {id: 'term', title:'TERM'}
  ]
});


async function processLineByLine() {
    const fileStream = fs.createReadStream(title);
  
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
  
    for await (const line of rl) {
      console.log(`Line from file: ${line}`);
      
        await puppeteerGoogleScraper(line, {
          limit: 3,
          headless: true,
          searchUrl: "https://google.it"
          }).then(d => {        
          csvWriter.writeRecords(d)       
              .then(() => {
                  console.log('...Done');
              });        
          
      }).catch(err => {
          console.error(err)
      })
      
        
      
    }
  }
  
  processLineByLine();
