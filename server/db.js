const mongoose = require('mongoose');

const uri = 'mongodb://vitalik:%40Mi1919900990ReN'
  + '@cluster0-shard-00-00-4p1ds.mongodb.net:27017,cluster0-shard-00-01-4p1ds.mongodb.net:27017,cluster0-shard-00-02-4p1ds.mongodb.net:27017/'
  + 'trading'
  + '?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';

mongoose.connect(uri).catch(err => {});

const db = mongoose.connection;

db.on('error', err => console.error(err));
db.once('open', () => {
  console.log('db connected');
});