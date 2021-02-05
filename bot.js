const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require('node-fetch');
require('dotenv').config();

const token = process.env.NODE_ENV_TOKEN;
const apiKey = process.env.NODE_ENV_API_KEY;

const fetchRandomFact = async () => {
  const res = await fetch(
    'https://uselessfacts.jsph.pl/random.json?language=en',
    {
      method: 'GET',
    }
  );
  const json = await res.json();
  return json.text;
};

const requestOptions = {
  method: 'GET',
  headers: {
    'X-CMC_PRO_API_KEY': apiKey,
    'Content-Type': 'application/json',
  },
  json: true,
  gzip: true,
};

let listOfCurrencies = [];

const getListCryptos = async () => {
  const res = await fetch(
    `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest`,
    requestOptions
  );
  const json = await res.json();
  listOfCurrencies = json.data.map((coin) => coin.symbol);
  return json.data.map((coin) => coin.symbol);
};

const fetchStonksPrice = async (coin) => {
  const res = await fetch(
    `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${coin}&convert=GBP`,
    requestOptions
  );
  const json = await res.json();
  const key = Object.keys(json.data)[0];
  return json.data[key].quote.GBP.price;
};

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', async (msg) => {
  if (msg.content === '-list') {
    const getList = await getListCryptos();
    msg.reply(getList);
  }
});

client.on('message', async (msg) => {
  let message = msg.content;
  if (message.includes('stonks')) {
    const remove = message.replace('stonks ', '');
    const price = await fetchStonksPrice(remove);
    msg.reply('Current price: £ ' + price);
  }
});

client.login(token);
