const { now } = require('moment');
const InstructionModel = require('../models/instruction.model.js');

exports.find = (req, res) => {
  var searchQuery = req.params.copyString;
  InstructionModel.find({ 'WI_Name': { '$regex': searchQuery } })
    .then(Instructions => {
      res.status(200).json(Instructions);
    }).catch(error => {
      res.status(500).json({ status: 500, message: 'Unable to get the Work Instructions details!', error });
    });
}

exports.create = (req, res) => {
  const instruction = new InstructionModel({
    WI_Id: req.body.WI_Id || null,
    Categories: req.body.Categories || null,
    WI_Name: req.body.WI_Name || "Untitled Instruction",
    WI_Desc: req.body.WI_Desc || null,
    Tools: req.body.Tools || null,
    Equipements: req.body.Equipements || null,
    Locations: req.body.Locations || null,
    IsFavorite: req.body.IsFavorite || false,
    CreatedBy: req.body.CreatedBy || null,
    EditedBy: req.body.EditedBy || null,
    AssignedObjects: req.body.AssignedObjects || null,
    SpareParts: req.body.SpareParts || null,
    SafetyKit: req.body.SafetyKit || null,
    Published: req.body.Published || false,
    IsPublishedTillSave: req.body.IsPublishedTillSave || false,
    Cover_Image: req.body.Cover_Image || null,
  });
  instruction.save()
    .then(data => {
      res.status(201).json(data);
    }).catch(error => {
      res.status(500).json({ status: 500, message: 'Unable to create a Work Instruction!', error });
    });
};

exports.findAll = (req, res) => {
  InstructionModel.find()
    .then(Instructions => {
      res.status(200).json(Instructions);
    }).catch(error => {
      res.status(500).json({ status: 500, message: 'Unable to get Work Instructions details!', error });
    });
};

exports.findOne = (req, res) => {
  InstructionModel.findById(req.params.Id).exec((error, obj) => {
    if (error) {
      res.status(500).json({ status: 500, message: 'Unable to get Work Instruction details!', error })
    } else {
      var instruction = (obj === null) ? {} : obj
      res.status(200).json(instruction);
    }
  })
}

exports.update = (req, res) => {
  InstructionModel.findByIdAndUpdate(req.params.Id, {
    WI_Id: req.body.WI_Id,
    Categories: req.body.Categories,
    WI_Name: req.body.WI_Name,
    WI_Desc: req.body.WI_Desc,
    Tools: req.body.Tools,
    Equipements: req.body.Equipements,
    Locations: req.body.Locations,
    IsFavorite: req.body.IsFavorite,
    CreatedBy: req.body.CreatedBy,
    EditedBy: req.body.EditedBy,
    AssignedObjects: req.body.AssignedObjects,
    SpareParts: req.body.SpareParts,
    SafetyKit: req.body.SafetyKit,
    Published: req.body.Published,
    IsPublishedTillSave: req.body.IsPublishedTillSave,
    Cover_Image: req.body.Cover_Image,
    updated_at: new Date()

  }, { new: true })
    .then(Instruction => {
      res.status(204).send();
    }).catch(error => {
      return res.status(500).json({ status: 500, message: "Error updating WorkInstruction with id" + req.params.Id, error })
    });
};

exports.delete = (req, res) => {
  InstructionModel.findByIdAndRemove(req.params.Id)
    .then(Instruction => {
      res.status(204).send();
    }).catch(error => {
      return res.status(500).json({ status: 500, message: "Could not delete WorkInstruction with id" + req.params.Id, error })
    });
};

exports.allInstructionsByCategory = (req, res) => {
  let id = req.params.CategoryId;
  InstructionModel.find()
    .then(Instructions => {
      Instructions = Instructions.map(instruction => {
        const index = JSON.parse(instruction.Categories).find(category => category.Category_Id === id);
        if (index) {
          return instruction;
        }
      }).filter(instruction => instruction);
      res.status(200).json(Instructions);
    }).catch(error => {
      res.status(500).json({ status: 500, message: 'Unable to get Work Instructions details!', error })
    });
};

exports.favInstructions = (req, res) => {
  var query = { IsFavorite: true };
  InstructionModel.find(query).exec((error, obj) => {
    if (error) {
      res.status(500).json({ status: 500, message: 'Unable to get favourite Work Instructions details!', error })
    } else {
      res.status(200).json(obj)
    }
  })
};

exports.draftedInstructions = (req, res) => {
  var query = { Published: false };
  InstructionModel.find(query).exec((error, obj) => {
    if (error) {
      res.status(500).json({ status: 500, message: 'Unable to get drafted Work Instructions details!', error })
    } else {
      res.status(200).json(obj)
    }
  })
};

exports.publishedInstructions = (req, res) => {
  var query = { Published: true };
  InstructionModel.find(query).exec((error, obj) => {
    if (error) {
      res.status(500).json({ status: 500, message: 'Unable to get published Work Instructions details!', error })
    } else {
      res.status(200).json(obj)
    }
  })
};

exports.getInstructionsByName = (req, res) => {
  var query = { WI_Name: req.params.name };
  InstructionModel.find(query).exec((error, obj) => {
    if (error) {
      res.status(500).json({ status: 500, message: 'Unable to get  Work Instructions details!', error })
    } else {
      res.status(200).json(obj)
    }
  })
};

exports.allRecentInstructions = (req, res) => {
  InstructionModel.find()
    .then(Instructions => {
      let date_ob = new Date();
      let date = ("0" + date_ob.getDate()).slice(-2);
      let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
      let year = date_ob.getFullYear()
      var todayDate = date + '-' + month + '-' + year;

      var data = [];
      for (var i in Instructions) {
        val = Instructions[i];
        if (val.created_at && val) {
          let widate = ("0" + val.created_at.getDate()).slice(-2);
          let wimonth = ("0" + (val.created_at.getMonth() + 1)).slice(-2);
          let wiyear = val.created_at.getFullYear();
          var wiCreatedDate = widate + '-' + wimonth + '-' + wiyear;

          if (wiCreatedDate == todayDate) {
            data.push(val);
          }
        }
      }
      res.status(200).json(data);
    }).catch(error => {
      res.status(500).json({ status: 500, message: 'Unable to get recent Work Instructions details!', error })
    });
};