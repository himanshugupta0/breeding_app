// const middleWare = require('../services/middleware');
const profile = require('../routes/profile');
// const project = require('../routes/project');


module.exports = function (app) {
    app.use('/api/profile', profile);
    // app.use('/api/project', project);
}
