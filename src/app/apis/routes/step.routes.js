module.exports = (router) => {
    const steps = require('../controllers/step.controller.js');

    // Create a new step
    router.post('/addStep', steps.create);

    router.get('/steps', steps.findAll);

    router.get('/steps/:Id', steps.findOne);

    router.put('/updateStep/:Id', steps.update);

    router.delete('/deleteStep/:Id', steps.delete);

    router.get('/stepsByInstructionId/:WI_Id', steps.stepsByInstructionId);

    router.get('/stepByName/:name', steps.stepByName);

    return router;
}
