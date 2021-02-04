const Discord = require("discord.js");
const client = new Discord.Client();
const fetch = require("node-fetch");
require("dotenv").config();

const token = process.env.NODE_ENV_TOKEN;

const fetchRandomFact = async () => {
  const res = await fetch(
    "https://uselessfacts.jsph.pl/random.json?language=en",
    {
      method: "GET",
    }
  );
  const json = await res.json();
  return json.text;
};

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("message", async (msg) => {
  if (msg.content === "-fact") {
    const fact = await fetchRandomFact();
    msg.reply(fact);
  }
});

client.login(token);
