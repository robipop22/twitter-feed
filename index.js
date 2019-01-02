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

app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader(
    'Access-Control-Allow-Origin',
    'http://localhost:8082',
    'https://robipop.io'
  )

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET')

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true)

  // Pass to next layer of middleware
  next()
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
      let formatedData = []
      let monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ]
      for (let i = 0; i < tweets.length; i++) {
        let tweetFormated = {}
        const {
          text,
          created_at,
          user,
          retweet_count,
          favorite_count,
          retweeted,
          retweeted_status,
          id_str
        } = tweets[i]
        const { name, screen_name, profile_image_url_https } = user
        if (retweeted) {
          tweetFormated.link = `https://twitter.com/${
            retweeted_status.user.screen_name
          }/status/${retweeted_status.id_str}`
        } else {
          tweetFormated.link = `https://twitter.com/${screen_name}/status/${id_str}`
        }
        const dateObj = new Date(created_at)
        tweetFormated.description = text
        tweetFormated.name = name
        tweetFormated.author = screen_name
        tweetFormated.imgURL = profile_image_url_https
        tweetFormated.retweetCount = retweet_count
        tweetFormated.favoriteCount = favorite_count
        tweetFormated.date = `${dateObj.getHours() || '00'}:${
          dateObj.getMinutes() < 10 ? '0' : ''
        }${dateObj.getMinutes()} - ${
          monthNames[dateObj.getMonth()]
        } ${dateObj.getDay()}, ${dateObj.getFullYear()}`
        formatedData.push(tweetFormated)
      }
      res.send({ tweets: formatedData })
    }
  })
})

app.listen(port, () => {
  console.log('We are live on ' + port)
})
