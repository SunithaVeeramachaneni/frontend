const Step = require('../models/step.model.js');

exports.create = (req, res) => {
  const step = new Step({
    WI_Id: req.body.WI_Id,
    Title: req.body.Title,
    Description: req.body.Description || null,
    Status: req.body.Status || null,
    Fields: req.body.Fields || null,
    Attachment: req.body.Attachment || null,
    Instructions: req.body.Instructions || null,
    Warnings: req.body.Warnings || null,
    Hints: req.body.Hints || null,
    isCloned: req.body.isCloned || false,
    Reaction_Plan: req.body.Reaction_Plan || null,
    Published: req.body.Published || false
  });
  step.save()
    .then(data => {
      res.status(201).json(data);
    }).catch(error => {
      res.status(500).json({ status: 500, message: 'Unable to create a Step!', error });
    });
};

exports.findAll = (req, res) => {
  Step.find()
    .then(steps => {
      res.status(200).json(steps);
    }).catch(error => {
      res.status(500).json({ status: 500, message: 'Unable to get Steps details!', error });
    });
};

exports.findOne = (req, res) => {
  Step.findById(req.params.Id).exec((error, obj) => {
    if (error) {
      res.status(500).json({ status: 500, message: 'Unable to get the Step details!', error })
    } else {
      var step = (obj === null) ? {} : obj
      res.status(200).json(step);
    }
  })
}

exports.update = (req, res) => {
  Step.findByIdAndUpdate(req.params.Id, {
    WI_Id: req.body.WI_Id,
    Title: req.body.Title || "Untitled Steps",
    Description: req.body.Description,
    Status: req.body.Status,
    Fields: req.body.Fields,
    Attachment: req.body.Attachment,
    Instructions: req.body.Instructions,
    Warnings: req.body.Warnings,
    Hints: req.body.Hints,
    isCloned: req.body.isCloned,
    Reaction_Plan: req.body.Reaction_Plan,
    Published: req.body.Published
  }, { new: true })
    .then(step => {
      res.status(204).send();
    }).catch(error => {
      return res.status(500).json({ status: 500, message: "Error updating Steps with id" + req.params.Id, error })
    });
};

exports.delete = (req, res) => {
  Step.findByIdAndRemove(req.params.Id)
    .then(step => {
      res.status(204).send();
    }).catch(error => {
      return res.status(500).json({ status: 500, message: "Could not delete Steps with id" + req.params.Id, error })
    });
};

exports.stepsByInstructionId = (req, res) => {
  var query = { WI_Id: req.params.WI_Id };
  Step.find(query).exec((error, obj) => {
    if (error) {
      res.status(500).json({ status: 500, message: 'Unable to get Steps details!', error })
    } else {
      res.status(200).json(obj)
    }
  })
};

exports.stepByName = (req, res) => {
  var query = { Title: req.params.name };
  Step.find(query).exec((error, obj) => {
    if (error) {
      res.status(500).json({ status: 500, message: 'Unable to get Steps details!', error })
    } else {
      res.status(200).json(obj)
    }
  })
};
