var mongoose = require('mongoose');
var mongoURL = 'mongodb://localhost/test'

mongoose.connect(mongoURL);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('connected! yay!')
});

var saveTweet = function() {
  console.log('saving a tweet');
};

saveTweet();



var Tweet = mongoose.model('Tweet', {
  id: String,
  text: String,
  meta: {
    syllables: Number,
    syllables: Number,
    
     tweeter username?
    syllable count   8
    rhyming index   buh-ree-toe
    total stress pattern   0 1/0 1/1 0/0/1 0/0
  }
});