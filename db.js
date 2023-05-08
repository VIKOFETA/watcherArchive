const { database } = require('./config');
const path = require('path');
const typeorm = require("typeorm")

const dataSource = new typeorm.DataSource({
    type: database.type,
    host: database.address,
    port: 3306,
    username: database.login,
    password: database.password,
    database: database.database,
    // logging: true,
    synchronize: true,
    entities: [ path.join(__dirname, "entities/**/*.js") ],
})

dataSource
    .initialize()
    .then(function () {
        console.log('Connection to database successful');
    }).catch(function (error) {
        console.log("Connection to database error: ", error)
    })

module.exports = dataSource;
