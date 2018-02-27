'use strict';
/*eslint no-process-env:0*/

var sql = require("mssql");
const pool = new sql.ConnectionPool({
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    server: process.env.SERVER,
    database: process.env.DATABASE
})

pool.connect(err => {
    if (err) console.log(err);
});


// Production specific configuration
// =================================
module.exports = {
    // Server IP
    ip: process.env.OPENSHIFT_NODEJS_IP ||
        process.env.ip ||
        undefined,

    // Server port
    port: process.env.OPENSHIFT_NODEJS_PORT ||
        process.env.PORT ||
        8080,

    sequelize: {
        uri: process.env.SEQUELIZE_URI ||
            'sqlite://',
        options: {
            logging: false,
            // storage: 'dist.sqlite',
            define: {
                timestamps: false
            }
        }
    },
    mssql: pool
};