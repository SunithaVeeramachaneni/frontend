module.exports = (app) => { 
    const category = require('../controllers/category.controller.js');

    // Create a new category
    app.post('/addCategory', category.create);

    // Retrieve all category
    app.get('/categories', category.findAll);

    // Retrieve a single category with ObjectId
    app.get('/categories/:Id', category.findOne);

    // Update a category with categoryId
    app.put('/updateCategory/:Id', category.update);

    // Delete a category with categoryId
    app.delete('/deleteCategory/:Id', category.delete);

    app.get('/getCategoriesByName/:name', category.getCategoriesByName);
}
