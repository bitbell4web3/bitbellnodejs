const dbConfig = require("config").db;
const Sequelize = require("sequelize");
console.info("dbConfig:",dbConfig)
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: dbConfig.port,
  operatorsAliases: false,
  timezone: '+08:00',
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});
const db = {};
const User = require('./user')(sequelize, Sequelize);
const SpotSymbolPrice = require('./spot_symbol_price')(sequelize, Sequelize);
const UserRegCode = require('./user_reg_code')(sequelize, Sequelize);

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = User
db.SpotSymbolPrice = SpotSymbolPrice
db.UserRegCode = UserRegCode

module.exports = db;

module.exports = {
db,
User,
SpotSymbolPrice,
UserRegCode
}