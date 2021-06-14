module.exports = (router) => {
    const user = require('../controllers/user.controller.js');

    // Create a new User
    router.post('/addwiUser', user.create);

    // Retrieve all Users
    router.get('/wiusers', user.findAll);

    // Retrieve a single User based on email
    router.get('/wiuser/:email', user.getUsersByEmail);

    return router;
}
