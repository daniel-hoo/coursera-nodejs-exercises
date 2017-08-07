var mongoose = require('mongoose');

var Leaders = require('./models/leadership');

// Connection URL
var url = 'mongodb://localhost:27017/conFusion';
mongoose.connect(url, {
  useMongoClient: true
});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log("Connected correctly to server");

  // create a new leader
  Leaders.create({
    name: 'Peter Pan',
    image: 'image/alberto.png',
    designation: 'Chief Epicurious Officer',
    abbr: 'CEO',
    description: 'Our CEO, Peter, ...'
  }, function (err, leader) {
    if (err) throw err;
    console.log('Leader created!');
    console.log(leader);

    var id = leader._id;

    // update the leader
    setTimeout(function () {
      Leaders.findByIdAndUpdate(id, {
          $set: {
            description: 'Updated Test'
          }
        }, {
          new: true
        })
        .exec(function (err, leader) {
          if (err) throw err;
          console.log('Updated Leader!');
          console.log(leader);

          db.collection('leadership').drop(function () {
            db.close();
          });
        });
    }, 3000);
  });
});
