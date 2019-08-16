const Sequelize = require('sequelize');

database = 'GARecord'
username = 'root'
password = 'Zjtapp@123'
host = 'localhost'

// Option 1: Passing parameters separately
const sequelize = new Sequelize(database, username, password, {
  host: host,
  dialect: 'mysql'/* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
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


sequelize.sync()
// sequelize.close()