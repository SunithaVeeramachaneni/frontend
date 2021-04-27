const Category = require('../models/category.model.js');

exports.create = (req, res) => {
    const category = new Category({
        Category_Name: req.body.Category_Name,
        Cover_Image: req.body.Cover_Image
    });
    category.save()
        .then(data => {
            res.status(201).json(data);
        }).catch(error => {
            res.status(500).json({ status: 500, message: 'Unable to create a Category!', error });
        });
};

exports.findAll = (req, res) => {
    Category.find()
        .then(category => {
            res.status(200).json(category);
        }).catch(error => {
            res.status(500).json({ status: 500, message: 'Unable to get Categories details!', error });
        });
};


exports.findOne = (req, res) => {
    Category.findById(req.params.Id).exec((error, obj) => {
        if (error) {
            res.status(500).json({ status: 500, message: 'Unable to get Category details!', error })
        } else {
            var category = (obj === null) ? {} : obj
            res.status(200).json(category);
        }
    })
}

exports.update = (req, res) => {
    Category.findByIdAndUpdate(req.params.Id, {
        Category_Name: req.body.Category_Name,
        Cover_Image: req.body.Cover_Image
    }, { new: true })
        .then(category => {
            res.status(204).send();
        }).catch(error => {
            return res.status(500).json({ status: 500, message: "Unable to update Category with id " + req.params.Id, error })
        });
};


exports.delete = (req, res) => {
    Category.findByIdAndRemove(req.params.Id)
        .then(category => {
            res.status(204).send();
        }).catch(error => {
            return res.status(500).json({ status: 500, message: "Unable to delete Category with id " + req.params.Id, error })
        });
};

exports.getCategoriesByName = (req, res) => {
    var query = { Category_Name: req.params.name };
    Category.find(query).exec((error, obj) => {
        if (error) {
            res.status(500).json({ status: 500, message: 'Unable to get Categories details!', error })
        } else {
            res.status(200).json(obj)
        }
    })
};