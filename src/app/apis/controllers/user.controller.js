const User = require('../models/user.model.js');

exports.create = (req, res) => {
    const user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        empId: req.body.empId,
    });
    user.save()
        .then(data => {
            res.status(201).json(data);
        }).catch(error => {
            res.status(500).json({ status: 500, message: 'Unable to register User!', error });
        });
};

exports.findAll = (req, res) => {
    User.find()
        .then(user => {
            res.status(200).json(user);
        }).catch(error => {
            res.status(500).json({ status: 500, message: 'Unable to get the User details!', error });
        });
};

exports.getUsersByEmail = (req, res) => {
    var query = { email: req.params.email };
    User.find(query).exec((error, obj) => {
        if (error) {
            res.status(500).json({ status: 500, message: 'Unable to get User details!', error })
        } else {
            res.status(200).json(obj)
        }
    })
};

