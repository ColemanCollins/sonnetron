var Twit = require('twit');
var rita = require('rita');
var fs = require('fs');

var d1 = new Date();//for debug time

var Bot = require('./bot');
var config1 = require('./config1');
var bot = new Bot(config1);

//start a server to look at the 
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
  var filterableTweet = [tweet];

  tweetCounter++
  fs.writeFile('./tweet-counter.html', '<!doctype html><html><head><meta charset="utf-8"><title></title></head><body><pre><code>' + '\n' + 'This robot has parsed ' + tweetCounter + ' tweets since its last deploy on ' + d1.toUTCString() + '.', encoding='utf8')

  var filteredTweet = 
  filterableTweet
  .filter(isEnglish)
  .filter(isNotARetweet)
  .filter(isNotAReply)
  .filter(hasNoURL)
  .filter(hasNoTickerSymbols)
  .filter(hasNoAttachedMedia)
  .filter(hasNoHashtags);

  if (filteredTweet[0] != undefined) {
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

//english only
function isEnglish(tweet) {
  if (tweet.lang === 'en') {
    return true;
  } else {
    return false;
  }
};

//no Retweets
function isNotARetweet(tweet) {
 if (!tweet.retweeted_status) {
  return true;
 } else {
  return false;
 }
};

//no mentions
function isNotAReply(tweet) {
  if (tweet.entities.user_mentions === undefined || !tweet.entities.user_mentions.length) {
    return true;
  } else {
    return false;
  }
};

//no URLs
function hasNoURL(tweet) {
 if (tweet.entities.urls === undefined || !tweet.entities.urls.length) { 
  return true;
 } else {
  return false;
 }
};

//no hashtags
function hasNoHashtags(tweet) {
 if (tweet.entities.hashtags === undefined || !tweet.entities.hashtags.length) { 
  return true;
 } else {
  return false;
 }
};

//no ticker symbols
function hasNoTickerSymbols(tweet) {
 if (tweet.entities.symbols === undefined || !tweet.entities.symbols.length) { 
  return true;
 } else {
  return false;
 }
};

//no attached mediua
function hasNoAttachedMedia(tweet) {
 if (tweet.entities.media === undefined || !tweet.entities.media.length) { 
  return true;
 } else {
  return false;
 }
};