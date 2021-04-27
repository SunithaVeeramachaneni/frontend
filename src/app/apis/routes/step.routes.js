module.exports = (app) => {
    const steps = require('../controllers/step.controller.js');

    // Create a new step
    app.post('/addStep', steps.create);

    app.get('/steps', steps.findAll);

    app.get('/steps/:Id', steps.findOne);

    app.put('/updateStep/:Id', steps.update);

    app.delete('/deleteStep/:Id', steps.delete);

    app.get('/stepsByInstructionId/:WI_Id', steps.stepsByInstructionId);

    app.get('/stepByName/:name', steps.stepByName);

}
