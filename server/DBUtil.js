// Creator for DB
const Sequelize = require('sequelize');

// Deafult settings
database = 'GARecord'
username = 'root'
password = 'Zjtapp@123'
host = 'localhost'

const sequelize = new Sequelize(database, username, password, {
  host: host,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
  }).catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Model: Service
class Service extends Sequelize.Model {}
Service.init({
    serviceID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    url: Sequelize.TEXT,
    available: Sequelize.BOOLEAN,
    currentUser: Sequelize.TEXT,
    game_id:Sequelize.DECIMAL,
    lockfile_path: Sequelize.STRING

}, { sequelize, modelName: 'Service' });

// Model: Games
class Games extends Sequelize.Model {}
Games.init({
  gameID: {
     type: Sequelize.STRING,
  },
  game_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  picurl: Sequelize.TEXT,
}, { sequelize, modelName: 'Games' });

// Model: Players
class Players extends Sequelize.Model {}
Players.init({
  playerID: {
     type: Sequelize.INTEGER,
     primaryKey: true,
     autoIncrement: true
  },
  playerAddress: Sequelize.TEXT,
  paymentChannelAddress: Sequelize.TEXT,
  accumulatedAmount: Sequelize.DOUBLE,
  latestSignature: Sequelize.TEXT
}, { sequelize, modelName: 'Players' });

// Model: Record
class Record extends Sequelize.Model {}
Record.init({
  RecordID: {
     type: Sequelize.INTEGER,
     primaryKey: true,
     autoIncrement: true
  },
  RecordChannelAddress: Sequelize.TEXT,
  lastSignature: Sequelize.TEXT,
  amount:Sequelize.TEXT
}, { sequelize, modelName: 'Record' });

module.exports.Service = Service
module.exports.Games = Games
module.exports.sequelize = sequelize
module.exports.Players = Players
module.exports.Record = Record