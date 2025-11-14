var mysql = require('mysql2');
var secretConfig = require('../secret-config.json');

function getMySQLConnection() {
    var con = mysql.createPool({
      connectionLimit : 90,
      host: secretConfig.DB_HOST,
      user: secretConfig.DB_USER,
      password: secretConfig.DB_PASSWORD,
      database: secretConfig.DB_NAME,
    });
    return con;
}

module.exports = {
    getMySQLConnection,
    default: {
        getMySQLConnection
    }
};