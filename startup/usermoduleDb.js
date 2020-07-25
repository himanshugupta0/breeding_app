const mongoose = require('mongoose');
const config = require('../config/usermoduleDatabase');
mongoose.Promise = global.Promise;

module.exports = function () {
    mongoose.set('useCreateIndex', true)
   return mongoose.createConnection(config.userModuleDatabase, { useNewUrlParser: true })
        .then((usermodule) => {
            // console.log(usermodule,"LLLLL");
            console.log('Connected to database ' + config.userModuleDatabase)
            return usermodule;
        })
        .catch(err => console.error('Error in connection' + err));
}
