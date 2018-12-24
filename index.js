const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const port = 8000

require('now-env')

var Twitter = require('twitter')
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

app.use(bodyParser.json())

app.get('/timeline', (req, res) => {
  var params = { user_id: req.query.user_id }

  client.get('statuses/user_timeline', params, function(
    error,
    tweets,
    response
  ) {
    if (!error) {
      res.send({ tweets })
    }
  })
})

app.listen(port, () => {
  console.log('We are live on ' + port)
})
