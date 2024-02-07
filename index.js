require('dotenv').config()
const ircClient = require('node-irc')
const axios = require('axios')
const NodeCache = require( "node-cache" );
const myCache = new NodeCache()

const { CHANNEL, USERS, BOT_NAME, HOST, PORT, BOT_NICK, RADIO_LINK, API, TEMAS, PASSWORD } = process.env
const params = [HOST, PORT, BOT_NICK, BOT_NAME]
PASSWORD && params.push(PASSWORD)
var client = new ircClient(...params);

client.on('ready', function () {
  client.join(CHANNEL);
});

client.on('PRIVMSG', function (data) {
  console.log('priv', data)
})

client.on('CHANMSG', function (data) {
  if (USERS.includes(data.sender)) {
    if (data.message === '+radio') {
      client.say(CHANNEL, RADIO_LINK);
    }
    if (data.message === '+temas') {
      myCache.set('scream', true)
      setTimeout(() => {
        myCache.set('scream', false)
      }, 1000 * 60 * parseInt(TEMAS))
    }
  }
})

setInterval(() => {
  axios.post(API)
    .then(res => {
      const prev = myCache.get("current")
      if (prev !== res.data.title && myCache.get('scream')) {
        client.say(CHANNEL, `${res.data.title} 🎶`);
        success = myCache.set("current", res.data.title);
      }
    })
}, 10000)
client.connect();