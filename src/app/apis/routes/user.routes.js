module.exports = (app) => {
    const user = require('../controllers/user.controller.js');

    // Create a new User 
    app.post('/addwiUser', user.create);

    // Retrieve all Users
    app.get('/wiusers', user.findAll);

    // Retrieve a single User based on email
    app.get('/wiuser/:email', user.getUsersByEmail);

}
