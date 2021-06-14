
var cors = require('cors');
module.exports = (router) => {
    const Instructions = require('../controllers/instruction.controller.js');

    router.post('/addWorkInstruction', Instructions.create);

    router.get('/allInstructions', Instructions.findAll);

    router.get('/allInstructions/:Id', Instructions.findOne);

    router.put('/updateInstruction/:Id', Instructions.update);

    router.delete('/deleteInstruction/:Id', Instructions.delete);

    router.get('/favInstructions', Instructions.favInstructions);

    router.get('/draftedInstructions', Instructions.draftedInstructions);

    router.get('/publishedInstructions', Instructions.publishedInstructions);

    router.get('/allRecentInstructions', Instructions.allRecentInstructions);

    router.get('/getInstructionsByName/:name', Instructions.getInstructionsByName);

    router.get('/allInstructionsByCategory/:CategoryId', Instructions.allInstructionsByCategory);


    router.get('/getCopyInstructionsByName/:copyString', cors(), Instructions.find);

    return router;
}
