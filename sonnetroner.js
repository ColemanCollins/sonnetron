var express = require('express')
    server = express(),
    mongoose = require('mongoose'),
    db = mongoose.connect('mongodb://localhost/sonnetron'),
    Twit = require('twit'),
    rita = require('rita'),
    Bot = require('./bot'),
    config1 = require('./config1'),
    bot = new Bot(config1),
    stream = bot.twit.stream('statuses/sample'),
    date = new Date();
 
//----------turn express on------------//
server.listen(5000);

//----------define what a tweet means------------//
var Tweet = mongoose.model('Tweet', {
  tweetID: Number,
  text: String,
  username: String,
  features: {}
});


//----------parse and save the tweet------------//
stream.on('tweet', function (tweet) {

  //filter them tweets
  var usableTweet = basicFilters.reduce( function(previous, current) {
    return previous && current(tweet);
  }, true );

  if (usableTweet) {
    //construct a tweet to save
    var tweetToSave = new Tweet();
    tweetToSave.tweetID = tweet.id;
    tweetToSave.text = tweet.text;
    tweetToSave.username = tweet.user.screen_name;
    tweetToSave.features = rita.RiString(tweet.text).features();

    //save that tweet!
    tweetToSave.save(function(err) {
      if (err) throw err;
      console.log('saved a tweet!');
    });  
  }

});


//----------show me the money (at localhost:5000/user/)------------//

//show me the tweets in the db
server.get('/tweets', function(req, res) {
    res.contentType('text/plain');  
    
    Tweet.find({}, function(err, tweets) {
      if (tweets != null) {
        res.send( 
          '<html><body>' +
          for (var i = 0, i <= tweets.length - 1; i++) {
            '<p>' + tweets[i].tweetID + ': ' + tweets[i].text +'</p>'
          };
         + '</html></body>'
        );
      } else {
        res.send('Sonnetron has not parsed any tweets yet.');
      }
    });
});


//show me the tweets in the db as the json output of the saved document objects
server.get('/raw', function(req, res) {
    res.contentType('application/json');  
    
    Tweet.find({}, function(err, tweets) {
      if (tweets != null) {
        res.send(JSON.stringify(tweets, null, 4));
      } else {
        res.send('Sonnetron has not parsed any tweets yet.');
      }
    });
});


//show me the number of tweets in the db
server.get('/count', function(req, res) {
    res.contentType('text/plain');  
    
    Tweet.count({}, function(err, saveCount) {
      res.send(
        // 'Sonnetron has parsed ' + parseCount + ' tweets since its last deploy on ' + date.toUTCString() + '.  ' +
        'Sonnetron has saved ' + saveCount + ' tweets since its last deploy on ' + date.toUTCString() + '.'
        );
    });
});




//----------Define Dem Basic Filters------------//
var basicFilters = [
  isEnglish,
  isNotARetweet,
  isNotAReply,
  hasNoURL,
  hasNoTickerSymbols,
  hasNoAttachedMedia,
  hasNoHashtags
]

//english only
function isEnglish(tweet) {
   return tweet.lang === 'en';
};

//no Retweets
function isNotARetweet(tweet) {
  return !tweet.retweeted_status;
};

//no mentions
function isNotAReply(tweet) {
  return tweet.entities.user_mentions === undefined || !tweet.entities.user_mentions.length;
};

//no URLs
function hasNoURL(tweet) {
  return tweet.entities.urls === undefined || !tweet.entities.urls.length;
};

//no hashtags
function hasNoHashtags(tweet) {
  return tweet.entities.hashtags === undefined || !tweet.entities.hashtags.length;
};

//no ticker symbols
function hasNoTickerSymbols(tweet) {
  return tweet.entities.symbols === undefined || !tweet.entities.symbols.length;
};

//no attached mediua
function hasNoAttachedMedia(tweet) {
  return tweet.entities.media === undefined || !tweet.entities.media.length; 
};