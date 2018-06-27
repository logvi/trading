const mongoose = require('mongoose');

const dbConfig = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD
};

if (!dbConfig.username || !dbConfig.password) throw new Error('no db config');

const uri = `mongodb://${dbConfig.username}:${dbConfig.password}@cluster0-shard-00-00-4p1ds.mongodb.net:27017,cluster0-shard-00-01-4p1ds.mongodb.net:27017,cluster0-shard-00-02-4p1ds.mongodb.net:27017/trading?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin`;

mongoose.connect(uri).catch(err => {});

const db = mongoose.connection;

db.on('error', err => console.error(err));
db.once('open', () => {
  console.log('db connected');
});