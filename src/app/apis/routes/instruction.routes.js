
var cors = require('cors');
module.exports = (app) => {
    const Instructions = require('../controllers/instruction.controller.js');

    app.post('/addWorkInstruction', Instructions.create);

    app.get('/allInstructions', Instructions.findAll);

    app.get('/allInstructions/:Id', Instructions.findOne);

    app.put('/updateInstruction/:Id', Instructions.update);

    app.delete('/deleteInstruction/:Id', Instructions.delete);

    app.get('/favInstructions', Instructions.favInstructions);

    app.get('/draftedInstructions', Instructions.draftedInstructions);

    app.get('/publishedInstructions', Instructions.publishedInstructions);

    app.get('/allRecentInstructions', Instructions.allRecentInstructions);

    app.get('/getInstructionsByName/:name', Instructions.getInstructionsByName);

    app.get('/allInstructionsByCategory/:CategoryId', Instructions.allInstructionsByCategory);


    app.get('/getCopyInstructionsByName/:copyString', cors(), Instructions.find);

}
