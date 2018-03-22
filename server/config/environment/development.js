'use strict';
/*eslint no-process-env:0*/

var sql = require("mssql");
const pool = new sql.ConnectionPool({
    user: process.env.SQL_USER,
    password: process.env.SQL_PWD,
    server: process.env.SERVER,
    database: process.env.DATABASE
})

pool.connect(err => {
    if (err) console.log(err);
    console.log('connected');
});

// console.log(pool);


// Development specific configuration
// ==================================
module.exports = {

    // Sequelize connection opions
    sequelize: {
        uri: process.env.SEQUELIZE_URI,
        // uri: 'sqlite://',
        options: {
            logging: false,
            // storage: 'dev.sqlite',
            define: {
                timestamps: false
            }
        }
    },
    mssql: pool,
    // Seed database on startup
    seedDB: false

};