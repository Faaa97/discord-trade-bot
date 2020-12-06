const https = require('https');

require('dotenv').config();
const apiKey = process.env.BACKPACK_TF_APIKEY;

const url = 'https://backpack.tf/api/classifieds/search/v1?&key=' + apiKey;
const args = '&intent=dual&page_size=30&fold=0&item_names=1';

// Function that makes a HTTP GET call
function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (resp) => {
      let data = '';
  
      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });
  
      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        resolve(data);
      });
  
    }).on("error", (err) => {
      reject("Error: " + err.message);
    });
  });
};

const getPrices = (item) => {
  const itemUrl = '&item=' + item.replace(' ', '%20').replace('\'','%27') + '&quality=6';
  const comparator = listing => listing.automatic === 1 ? true : false;
  const priceAsString = listing => {
    const price = listing.currencies;
    return `${price.keys || 0},${price.metal || 0}`;
  }
  const recount = (array) => {
    let obj = {};
    array.forEach((element) => {
      obj[element] = obj[element] + 1 || 1;
    });
    return obj;
  };
  return new Promise((resolve, reject) => {
    get(url + args + itemUrl).then((data) => {
      const dataObj = JSON.parse(data);
      const listings = {
        buy: dataObj.buy.listings.filter(comparator),
        sell: dataObj.sell.listings.filter(comparator),
      };
      const prices = {
        buy: recount(listings.buy.map(priceAsString)),
        sell: recount(listings.sell.map(priceAsString)),
      }
      resolve(prices);
    }).catch((error) => {
      reject(error);
    });
  });
};

module.exports = getPrices;

/*
// Usage example: 

const items = [
  `Ye Olde Rustic Colour`,
  `Muskelmannbraun`,
  `Indubitably Green`,
  `A Color Similar to Slate`,
  `Zepheniah's Greed`,
  `Peculiarly Drab Tincture`,
  `Radigan Conagher Brown`,
  `A Deep Commitment to Purple`,
  `Australium Gold`,
  `Bill's Hat`,
];
let array = [];
let totalItems = items.length;
items.forEach((item) => {
  getPrices(item).then((price) => {
    let obj = {};
    obj.item = item;
    obj.listings = price;
    array.push(obj);
    if(array.length === totalItems) {
      fs.writeFile(file, JSON.stringify(array, null, 1), (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('Results in ' + file);
        }
      });
    }
  });
});
*/
