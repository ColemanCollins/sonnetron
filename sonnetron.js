var Twit = require('twit');
var rita = require('rita');
var fs = require('fs');

var d1 = new Date();//for debug time

var Bot = require('./bot');
var config1 = require('./config1');
var bot = new Bot(config1);

//start a server to look at the output logs
var static = require('node-static');
var file = new static.Server();
console.log('Server is running');
require('http').createServer(function(request, response) {
  request.addListener('end', function() {
    file.serve(request, response);
  }).resume();
}).listen(process.env.PORT || 3000);

//initialize the stream
var stream = bot.twit.stream('statuses/sample');
console.log('Sonnetron is Running');

fs.appendFileSync('./index.html', 'running...', encoding='utf8');

//every time the stream fires off a tweet, filter the tweet.
//save the tweet if it passes all of the filters
tweetCounter = 0;

stream.on('tweet', function (tweet) {

  tweetCounter++
  fs.writeFile('./tweet-counter.html', '<!doctype html><html><head><meta charset="utf-8"><title></title></head><body><pre><code>' + '\n' + 'This robot has parsed ' + tweetCounter + ' tweets since its last deploy on ' + d1.toUTCString() + '.', encoding='utf8')

  //run the tweet by all of the filters and then reduce the response into a bool true/false.
  var usableTweet = basicFilters.reduce( function(previous, current) {
    return previous && current(tweet);
  }, true );

  if (usableTweet) {
    var tweetParse = rita.RiString(tweet.text).features().stresses;
    var stressNumbersOnly = tweetParse.replace(/\D/g,'');
    tweetVal = tweet.id + ': ' + tweet.text + '\n';
    //log the sonnet verses
    if ( /^0101010101$/gm.test(stressNumbersOnly) ) {
      fs.appendFileSync('./sonnetron.html', tweetVal, encoding='utf8');
    } 
    //log the long limerick verses
    else if ( /^010010010?$/gm.test(stressNumbersOnly) ) {
      fs.appendFileSync('./limericker-long.html', tweetVal, encoding='utf8');
    }
    //log the short limerick verses
    else if ( /^010010?$/gm.test(stressNumbersOnly) ) {
      fs.appendFileSync('./limericker-short.html', tweetVal, encoding='utf8');
    }
    //additional long verse tests
    else if ( /^111110010?$/gm.test(stressNumbersOnly) ) {
      fs.appendFileSync('./limericker-test-long.html', tweetVal, encoding='utf8');
    }
    //additional short verse tests
    else if ( /^110010?$/gm.test(stressNumbersOnly) ) {
      fs.appendFileSync('./limericker-test-short.html', tweetVal, encoding='utf8');
    }
    else if ( /^(0|1)(0|1)1(0|1)(0|1)0010?$/gm.test(stressNumbersOnly) ) {
      fs.appendFileSync('./limericker-easy-test.html', tweetVal, encoding='utf8');
    }
  } 
});

//---------Define Dem Basic Filters-------//
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