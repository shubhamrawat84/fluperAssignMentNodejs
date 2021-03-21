
'use strict';

var mongoose                    = require('mongoose');
var Mongo_options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  autoIndex: false,
  poolSize: 5,
  bufferMaxEntries: 0,
  connectTimeoutMS: 12000,
  socketTimeoutMS: 12000,
  family: 4
};
var uri = 'mongodb://localhost/fluper';
exports.StartConnection = () => {
    mongoose.connect(uri, Mongo_options)
    .then(() =>  console.log('connection succesful'))
    .catch((err) => console.error(err));
}
exports.DB = mongoose.connection;





