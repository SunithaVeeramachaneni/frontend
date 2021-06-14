module.exports = (router) => {
    const category = require('../controllers/category.controller.js');

    // Create a new category
    router.post('/addCategory', category.create);

    // Retrieve all category
    router.get('/categories', category.findAll);

    // Retrieve a single category with ObjectId
    router.get('/categories/:Id', category.findOne);

    // Update a category with categoryId
    router.put('/updateCategory/:Id', category.update);

    // Delete a category with categoryId
    router.delete('/deleteCategory/:Id', category.delete);

    router.get('/getCategoriesByName/:name', category.getCategoriesByName);

    return router;
}
