//const title = "Italy sites";
const puppeteerGoogleScraper = require("puppeteer-google-scraper");
const readline = require('readline');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
// const csvWriter = createCsvWriter({
//     path: title + '5.csv',
//     header: [
//         {id: 'title', title: 'TITLE'},
//         {id: 'url', title: 'URL'},
//         {id: 'term', title:'TERM'}
//     ]
// });

// const csvSocialWriter = createCsvWriter({
//   path: title + '_social.csv',
//   header: [
//       {id: 'title', title: 'TITLE'},
//       {id: 'url', title: 'URL'},
//       {id: 'term', title:'TERM'}
//   ]
// });

var current = new Date();


const {Client} = require('pg')
const client = new Client({
    user: "kmpirslfxqkekw",
    password: "935ee2dec90c8204f1780f520e5ec014dcdf93dc58357026da0ae17b99c5c6d2",
    host: "ec2-54-145-224-156.compute-1.amazonaws.com",
    port: process.env.PORT || 5432,
    database: "d22kk4lmadgg7c"
})

const query = {
    text: 'SELECT * FROM test_terms ORDER BY search_term ASC',
    rowMode: 'array'
};

async function processLineByLine() {
    // const fileStream = fs.createReadStream(title);
  
    // const rl = readline.createInterface({
    //   input: fileStream,
    //   crlfDelay: Infinity
    // });
    client.connect()
    .then(() => console.log("connestion sucessful"))
    .then(() => client.query(query))
    .then(async res => {
        const data = res.rows;
        console.log(data);
        for(const row of data) {
            //console.log(`1. row: ${row[0]} 2. row ${row[1]}`);
            console.log(row[0].trim())  
            await puppeteerGoogleScraper(row[0].trim(), {
              limit: 3,
              headless: true,
              searchUrl: "https://google.hr"
              }).then(async d => {
                console.log(d)
                for(i = 0; i < Object.keys(d).length; i++){
                  console.log("Title: ", d[i].title, " URL: ", d[i].url, " term: ", d[i].term)
                  client.query(`INSERT INTO results (term, title, url, timestamp, country)
                  VALUES ($1, $2, $3, $4, $5)`, [row[0].trim(), d[i].title, d[i].url, current, "Cro"])
                  .catch(err => {
                    console.log("Problem:", err);
                  })
                }
            })
            .catch(err => {
              console.log("Problem: ", err);
            })
        }
      })
        // .catch(err => {
        //   console.log(err)
        // })
        .catch(e => console.log("Problem: ", e))
        .finally(() => client.end())
    }
    


  
    // for await (const line of rl) {
    //   console.log(`Line from file: ${line}`);
      
    //     await puppeteerGoogleScraper(line, {
    //       limit: 3,
    //       headless: true,
    //       searchUrl: "https://google.it"
    //       }).then(d => {        
    //       csvWriter.writeRecords(d)       
    //           .then(() => {
    //               console.log('...Done');
    //           });        
          
    //   }).catch(err => {
    //       console.error(err)
    //   })
      
        
      
    // }
  //}
  
  processLineByLine();
