const express = require('express');
const fs = require('fs');
const multer = require('multer');
const speechToTextConverterRouter = express.Router();
const speech = require('@google-cloud/speech').v1p1beta1;
const ffmpeg = require('fluent-ffmpeg');
const constants = require("./constants");
const Instruction = require('./models/instruction.model');
const Step = require('./models/step.model');
const dirName = 'AudioOrVideoFiles';
const spliFileDuration = 20;
const encoding = 'FLAC';
const languageCode = 'en-US';
const sampleRateHertz = 44100;
const enableAutomaticPunctuation = true;
const alternativeLanguageCodes = ['en-IN', 'en-US'];
let enableWordTimeOffsets = true;

if (!fs.existsSync(dirName)) {
  fs.mkdirSync(dirName);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dirName);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  console.log(file.mimetype);
  if (file.mimetype.indexOf('audio') > -1  || file.mimetype.indexOf('video') > -1) {
    cb(null, true);
  } else {
    req.fileValidationError = 'Invalid mime type';
    cb(null, false, new Error('Invalid mime type'));
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

const client = new speech.SpeechClient();

const speechToText = filePath => {
  return new Promise((resolve, reject) => {
    const audio = {
      content: fs.readFileSync(filePath).toString('base64'),
    };
    const config = {
      encoding,
      languageCode,
      enableWordTimeOffsets
    };
    const request = {
      audio,
      config
    };
    let screenShotSeconds = [];
    let startSecs;

    const result = async () => {
      try {
        const [operation] = await client.longRunningRecognize(request);
        const [response] = await operation.promise();
        const transcription = response.results.map(result => {
          const { screenShotSecs, prevStartSecs }  = avgWordTimings(result.alternatives[0].words, startSecs);
          startSecs = prevStartSecs;
          screenShotSeconds = [...screenShotSeconds, ...screenShotSecs];
          return result.alternatives[0].transcript
        })
        .join(' ');
        resolve({ transcription, screenShotSecs: screenShotSeconds });
      } catch (error) {
        reject({ message: 'Unable to do transcription!', error });
      }
    }
    result();
  })
}

const speechToTextWithStream = (filepath, key) => {
  return new Promise((resolve, reject) => {
    const config = {
      encoding,
      sampleRateHertz,
      languageCode,
      enableWordTimeOffsets,
      enableAutomaticPunctuation,
      // alternativeLanguageCodes
    };
    const request = {
      config,
      interimResults: false, // If you want interim results, set this to true
    };
    let transcription = [];
    let screenShotSeconds = [];
    let startSecs;

    const recognizeStream = client
      .streamingRecognize(request)
      .on('error', error => {
        reject({ message: 'Unable to do transcription!', error });
      })
      .on('data', data => {
        // console.log(JSON.stringify(data.results[0]));
        // console.log(data.results[0]);
        /* console.log(
          `Transcription: ${data.results[0].alternatives[0].transcript}`
        ); */
        transcription = [...transcription, data.results[0].alternatives[0].transcript];
        const { screenShotSecs, prevStartSecs } = avgWordTimings(data.results[0].alternatives[0].words, startSecs);
        startSecs = prevStartSecs;
        screenShotSeconds = [...screenShotSeconds, ...screenShotSecs];
      })
      .on('end', () => {
        resolve({ [key]:  transcription.join(' '), screenShotSecs: screenShotSeconds });
      });

    fs.createReadStream(filepath).pipe(recognizeStream);
  })
}

const avgWordTimings = (words, prevStartSecs = undefined) => {
  let avgSecs = [];
  let startSecs, endSecs;
  startSecs = prevStartSecs ? prevStartSecs : startSecs;
  words.forEach(wordInfo => {
    // NOTE: If you have a time offset exceeding 2^32 seconds, use the
    // wordInfo.{x}Time.seconds.high to calculate seconds.
    if (wordInfo.word === constants.SCREEN_SHOT_WORD1) {
      startSecs = `${wordInfo.startTime.seconds}` + '.' + wordInfo.startTime.nanos / 100000000;
    }
    if (wordInfo.word === constants.SCREEN_SHOT_WORD2) {
      endSecs = `${wordInfo.endTime.seconds}` + '.' + wordInfo.endTime.nanos / 100000000;
      if (startSecs) {
        avgSecs = [...avgSecs, parseFloat(((parseFloat(startSecs) + parseFloat(endSecs)) / 2).toFixed(1))];
        startSecs = undefined;
      }
    }
  });
  return startSecs ? { screenShotSecs: avgSecs, prevStartSecs: startSecs } : { screenShotSecs: avgSecs };
}

const convertToFlac = filePath => {
  return new Promise((resolve, reject) => {
    const flacFilePath =  `${filePath}.flac`;
    ffmpeg(filePath)
      .output(flacFilePath)
      .audioChannels(1)
      .audioFrequency(44100)
      .on('end', function() {
        resolve({ flacFilePath });
      }).on('error', function(error){
        reject({ message: 'Unable to convert to flac!', error });
      }).run();
  });
}

const splitIntoMultipleFiles = filePath => {
  return new Promise((resolve, reject) => {
    let promises = [];
    const splitFilesPath = filePath.replace('.', '');
    if (!fs.existsSync(splitFilesPath)) {
      fs.mkdirSync(splitFilesPath, { recursive: true });
    }
    ffmpeg.ffprobe(filePath, async function(err, metadata) {
      if (err) {
        reject({ message: 'Unable to get file metadata!', error: err });
      } else {
        const { format: { duration } } = metadata;
        for (let i = 0; i < Math.ceil(duration/spliFileDuration) ; i++ ) {
          const { hours, minutes, seconds } = secondsToHms(i * spliFileDuration);
          const seekInput = `${hours}:${minutes}:${seconds}`;
          const output = `${splitFilesPath}/${i}.flac`;
          promises = [
            ...promises,
            splitFile(filePath, seekInput, output, spliFileDuration)
          ]
        }
        try {
          await Promise.all(promises);
          resolve({ folderPath: splitFilesPath, filesCount: Math.ceil(duration/spliFileDuration) });
        } catch (error) {
          reject(error);
        }
      }
    });
  })
}

const splitFile = (input, seekInput, output, fileDuration) => {
  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .seekInput(seekInput)
      .output(output)
      .audioChannels(1)
      .audioFrequency(44100)
      .duration(fileDuration)
      .on('end', () => {
        resolve({ success: true });
      })
      .on('error', error => {
        reject({ message: 'Unable to split file!', error });
      })
      .run();
  });
}

const secondsToHms = s => ({
  hours: ((s - s % 3600) / 3600) % 60,
  minutes: ((s - s % 60) / 60) % 60,
  seconds: s % 60
})

const takeScreenShot = (filePath, secs) => {
  return new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .screenshots({
        timestamps: [...secs],
        filename: 'thumbnail-at-%s-seconds.png',
        folder: `${dirName}/images`
      })
      .on('end', function() {
        resolve({ success: true });
      }).on('error', function(error){
        reject({ message: 'Unable to take screen shot!', error });
      });
  });
}

const createWorkInstruction = (message, userDetails) => {
  const { first_name = '', last_name = '' } = userDetails || {};
  const userName = `${first_name} ${last_name}`;
  return new Promise((resolve, reject) => {

    const { TITLE_START_POSSIBILITIES, TITLE_END_POSSIBILITIES } = constants;
    const { STEP_MESSAGE_START_POSSIBILITIES, STEP_MESSAGE_END_POSSIBILITIES } = constants;
    const { STEP_TITLE_START_POSSIBILITIES, STEP_TITLE_END_POSSIBILITIES } = constants;
    const { STEP_INS_START_POSSIBILITIES, STEP_INS_END_POSSIBILITIES } = constants;
    const { STEP_WARN_START_POSSIBILITIES, STEP_WARN_END_POSSIBILITIES } = constants;
    const { STEP_HINT_START_POSSIBILITIES, STEP_HINT_END_POSSIBILITIES } = constants;
    const { STEP_RPLAN_START_POSSIBILITIES, STEP_RPLAN_END_POSSIBILITIES } = constants;
    const { found: title } = extractDetails(message, 'TITLE', 0, TITLE_START_POSSIBILITIES, TITLE_END_POSSIBILITIES);
    console.log(title);

    let stepTitles = [];
    let stepIns = [];
    let stepWarn = [];
    let stepHint = [];
    let stepRPlan = [];

    for (let i = 1; i <= 30; i++) {
      const { actualMessage: actualStepMessage, found: stepMessageFound } = extractDetails(message, 'STEP_MESSAGE', i, STEP_MESSAGE_START_POSSIBILITIES, STEP_MESSAGE_END_POSSIBILITIES);
      if (stepMessageFound) {
        const { found, index } = extractDetails(actualStepMessage, 'STEP_TITLE', i, STEP_TITLE_START_POSSIBILITIES, STEP_TITLE_END_POSSIBILITIES);
        stepTitles = [...stepTitles, found];
        if (found) {
          const { found: ins } = extractDetails(actualStepMessage.slice(index), 'STEP_INS', i, STEP_INS_START_POSSIBILITIES, STEP_INS_END_POSSIBILITIES);
          stepIns = [...stepIns, ins];
          const { found: warn } = extractDetails(actualStepMessage.slice(index), 'STEP_WARN', i, STEP_WARN_START_POSSIBILITIES, STEP_WARN_END_POSSIBILITIES);
          stepWarn = [...stepWarn, warn];
          const { found: hint } = extractDetails(actualStepMessage.slice(index), 'STEP_HINT', i, STEP_HINT_START_POSSIBILITIES, STEP_HINT_END_POSSIBILITIES);
          stepHint = [...stepHint, hint];
          const { found: rPlan } = extractDetails(actualStepMessage.slice(index), 'STEP_RPLAN', i, STEP_RPLAN_START_POSSIBILITIES, STEP_RPLAN_END_POSSIBILITIES);
          stepRPlan = [...stepRPlan, rPlan];
        } else {
          stepIns = [...stepIns, found];
          stepWarn = [...stepWarn, found];
          stepHint = [...stepHint, found];
          stepRPlan = [...stepRPlan, found];
        }
      } else {
        stepTitles = [...stepTitles, stepMessageFound];
        stepIns = [...stepIns, stepMessageFound];
        stepWarn = [...stepWarn, stepMessageFound];
        stepHint = [...stepHint, stepMessageFound];
        stepRPlan = [...stepRPlan, stepMessageFound];
      }
    }

    console.log(stepTitles);
    console.log(stepIns);
    console.log(stepWarn);
    console.log(stepHint);
    console.log(stepRPlan);

    const categories = JSON.stringify([
      {Category_Id: '_UnassignedCategory_', Category_Name: 'Unassigned', Cover_Image: "assets/img/brand/category-placeholder.png"}
    ]);
    const coverImage = '../../assets/img/brand/doc-placeholder.png';

    if (title) {
      const instruction = new Instruction({
        WI_Id: null,
        WI_Name: title.trim(),
        Categories: categories,
        Cover_Image: coverImage,
        CreatedBy: userName,
        EditedBy: userName,
        WI_Desc: null,
        Tools: null,
        Equipements: null,
        Locations: null,
        IsFavorite: false,
        AssignedObjects: null,
        SpareParts: null,
        SafetyKit: null,
        Published: false,
        IsPublishedTillSave: false,
      });

      const create = async () => {
        try {
          const workInstruction = await instruction.save();
          const { _id: WI_Id } = workInstruction;
          // let promises = [];
          let steps = [];
          let stepsCount = 0;
          const actualSteps = stepTitles.filter(title => title);
          stepTitles.forEach(async (value, index) => {
            if (value) {
              /* promises = [
                ...promises,
                createStep(value, stepIns[index], stepWarn[index], stepHint[index], stepRPlan[index], WI_Id);
              ]; */
              try {
                const result = await createStep(value, stepIns[index], stepWarn[index], stepHint[index], stepRPlan[index], WI_Id);
                stepsCount++;
                steps = [...steps, result];
                if (stepsCount === actualSteps.length) {
                  resolve({ instruction: workInstruction, steps });
                }
              } catch (error) {
                reject(error);
              }
            }
          });
          /* try {
            const steps = await Promise.all(promises);
            resolve({ workInstruction, steps });
          } catch (error) {
            reject(error);
          } */
        } catch (error) {
          reject({ message: 'Unable to create a Work Instruction!', error });
        }
      }
      create();
    } else {
      reject({ message: 'transcription is not valid', error: { transcription: message } });
    }
  });
}

const createStep = (title, instructions, warnings, hints, reactionPlans, WI_Id) => {
  return new Promise((resolve, reject) => {
    const fields = fieldsObject(
      instructions,
      warnings,
      hints,
      reactionPlans,
      null
    )
    instructions = instructions ? instructionObject(instructions.trim(), 'Instruction') : null
    warnings = warnings ? instructionObject(warnings.trim(), 'Warning') : null
    hints = hints ? instructionObject(hints.trim(), 'Hint') : null
    reactionPlans = reactionPlans ? instructionObject(reactionPlans.trim(), 'Reaction Plan') : null
    const step = new Step({
      WI_Id,
      Title: title,
      Fields: fields,
      Instructions: instructions,
      Warnings: warnings,
      Hints: hints,
      Reaction_Plan: reactionPlans,
      Description: null,
      Status: null,
      Attachment: null,
      isCloned: false,
      Published: false
    });

    const create = async () => {
      try {
        const result = await step.save();
        resolve(result);
      } catch (error) {
        reject({ message: 'Unable to create a Step!', error });
      }
    }
    create();
  });
}

const matchData = (message, matchFor, step, startPossibilities = 0, endPossibilities = 0) => {
  let results = [];
  for (let i = 1; i <= startPossibilities; i++) {
    let MATCH_START = `${matchFor}_START${i}`;
    for (let j = 1; j <= endPossibilities; j++) {
      const MATCH_END = `${matchFor}_END${j}`;
      const comparison =  constants[MATCH_END].trim() ? '.*?' : '.*';
      let myRegex;
      if (MATCH_START === 'STEP_TITLE_START1' || MATCH_START === 'STEP_TITLE_START3' || MATCH_START === 'STEP_MESSAGE_START1' || MATCH_START === 'STEP_MESSAGE_START3') {
        myRegex = new RegExp(`${constants[MATCH_START].replace('${digit}', step)}(${comparison})${constants[MATCH_END]}`, 'i');
      } else if (MATCH_START === 'STEP_TITLE_START2' || MATCH_START === 'STEP_TITLE_START4' || MATCH_START === 'STEP_MESSAGE_START2' || MATCH_START === 'STEP_MESSAGE_START4') {
        myRegex = new RegExp(`${constants[MATCH_START].replace('${word}', constants.NUMBERS[step - 1])}(${comparison})${constants[MATCH_END]}`, 'i');
      } else if (MATCH_END === 'STEP_INS_END4' || MATCH_END === 'STEP_WARN_END3' || MATCH_END === 'STEP_HINT_END2' || MATCH_END === 'STEP_RPLAN_END1' || MATCH_END === 'STEP_MESSAGE_END1') {
        myRegex = new RegExp(`${constants[MATCH_START]}(${comparison})${constants[MATCH_END].replace('${digit}', step + 1)}`, 'i');
      } else if (MATCH_END === 'STEP_INS_END5' || MATCH_END === 'STEP_WARN_END4' || MATCH_END === 'STEP_HINT_END3' || MATCH_END === 'STEP_RPLAN_END2' || MATCH_END === 'STEP_MESSAGE_END2') {
        myRegex = new RegExp(`${constants[MATCH_START]}(${comparison})${constants[MATCH_END].replace('${word}', constants.NUMBERS[step])}`, 'i');
      } else {
        myRegex = new RegExp(`${constants[MATCH_START]}(${comparison})${constants[MATCH_END]}`, 'i')
      }
      const result = message.match(myRegex);
      results = [...results, result];
    }
  }
  results = results.filter(result => result);
  resultLengths = results.filter(result => {
    const [, found] = result;
    return found.length > 0;
  }).map(result => {
    const [, found] = result;
    return found.length;
  });
  const index = resultLengths.indexOf(Math.min(...resultLengths));
  return results[index];
}

const extractDetails = (message, extractFor, step, startPossibilities, endPossibilities) => {
  switch(extractFor) {
    case 'TITLE':
    case 'STEP_MESSAGE':
    case 'STEP_TITLE':
    case 'STEP_INS':
    case 'STEP_WARN':
    case 'STEP_HINT':
    case 'STEP_RPLAN':
      const result = matchData(message, extractFor, step, startPossibilities, endPossibilities) ?? [];
      const [actualMessage, found = null] = result;
      const { index } = result;
      return { actualMessage, found, index };
    default:
      return {};
  }
}

const instructionObject = (obj, type) => {
  let instructionObject = {
    "Title": type,
    "Active": "true",
    "FieldValue": convertStrToList(obj)
  };
  switch (type) {
    case "Attachment": {
      instructionObject = {
        ...instructionObject,
        "Position": 0,
        "FieldType": "ATT",
        "FieldCategory": "ATT"
      };
      break;
    }
    case "Instruction": {
      instructionObject = {
        ...instructionObject,
        "Position": 1,
        "FieldType": "RTF",
        "FieldCategory": "INS"
      };
      break;
    }
    case "Warning": {
      instructionObject = {
        ...instructionObject,
        "Position": 2,
        "FieldType": "RTF",
        "FieldCategory": "WARN"
      };
      break;
    }
    case "Hint": {
      instructionObject = {
        ...instructionObject,
        "Position": 3,
        "FieldType": "RTF",
        "FieldCategory": "HINT",
      };
      break;
    }
    case "ReactionPlan": {
      instructionObject = {
        ...instructionObject,
        "Position": 4,
        "FieldType": "RTF",
        "FieldCategory": "REACTION PLAN",
      };
      break;
    }
  }
  return JSON.stringify(instructionObject);
}

const convertStrToList = (obj) => {
  if (obj) {
    obj = obj ? obj.trim() : obj;
    if (/1\./.test(obj)) {
      const numberedList = obj.split(/^\d+\.+\s+|\s\d\.\s/);
      const listInfo = numberedList.shift();
      const numberedListResult = '<ol><li>' + numberedList.join("</li><li>") + '</li></ol>';
      return listInfo.trim() ? `<p>${listInfo}</p>${numberedListResult}` : numberedListResult;
    } else if (/●/.test(obj)) {
      const bulletedList = obj.split("●");
      const listInfo = bulletedList.shift();
      const bulletedListResult = '<ul><li>' + bulletedList.join("</li><li>") + '</li></ul>';
      return listInfo.trim() ? `<p>${listInfo}</p>${bulletedListResult}` : bulletedListResult;
    } else if (/number/.test(obj)) {
      const numberedList = obj.split(/number\s(?:one|two|three|four|five|six|seven|eight|nine|ten|to)|number\s\d*/);
      const listInfo = numberedList.shift();
      const numberedListResult = '<ol><li>' + numberedList.join("</li><li>") + '</li></ol>';
      return listInfo.trim() ? `<p>${listInfo}</p>${numberedListResult}` : numberedListResult;
    } else {
      const para = "<p>" + obj + "</p>";
      return para;
    }
  }
}

const fieldsObject = (ins, warn, hint, reactionplan, attachments) => {
  const instruction = ins ? convertStrToList(ins) : "";
  const warning = warn ? convertStrToList(warn) : "";
  const hints = hint ? convertStrToList(hint) : "";
  const reaction = reactionplan ? convertStrToList(reactionplan) : "";
  const fieldsObject = [
    {
      Title: "Attachment",
      Position: 0,
      Active: "true",
      FieldCategory: "ATT",
      FieldType: "ATT",
      FieldValue: attachments
    },
    {
      Title: "Instruction",
      Position: 1,
      Active: "true",
      FieldCategory: "INS",
      FieldType: "RTF",
      FieldValue: instruction
    },
    {
      Title: "Warning",
      Position: 2,
      Active: "true",
      FieldCategory: "WARN",
      FieldType: "RTF",
      FieldValue: warning
    },
    {
      Title: "Hint",
      Position: 3,
      Active: "true",
      FieldCategory: "HINT",
      FieldType: "RTF",
      FieldValue: hints
    },
    {
      Title: "Reaction Plan",
      Position: 4,
      Active: "true",
      FieldCategory: "REACTION PLAN",
      FieldType: "RTF",
      FieldValue: reaction
    }
  ];
  return JSON.stringify(fieldsObject);
}


const router = () => {
  speechToTextConverterRouter.post('/converter', upload.single('file'),
  async (req, res) => {
    if (req.fileValidationError) {
      res.status(500).send({ status: 500, message: req.fileValidationError });
    } else {
      const fileName = req.file.originalname;
      if (!(req.file.mimetype.indexOf('video') > -1) && enableWordTimeOffsets) {
        enableWordTimeOffsets = false;
      }
      console.log(enableWordTimeOffsets);
      const filePath = `${dirName}/${fileName}`;
      const userDetails = req.body.userDetails ? JSON.parse(req.body.userDetails) : {};
      try {
        const { flacFilePath } = await convertToFlac(filePath);
        /* const { folderPath, filesCount } = await splitIntoMultipleFiles(filePath);
        let promises = [];
        for (let i = 0; i < filesCount; i++) {
          promises = [
            ...promises,
            speechToTextWithStream(`${folderPath}/${i}.flac`, i)
          ];
        }
        const response = await Promise.all(promises);
        let responseObject = {};
        let screenShotSeconds = [];
        response.forEach(value => {
          const { screenShotSecs, ...rest } = value;
          const keys = Object.keys(rest);
          const screenShotSecsUpdated = screenShotSecs.map(sec => (parseInt(keys[0]) * spliFileDuration ) + sec);
          screenShotSeconds = [...screenShotSeconds, ...screenShotSecsUpdated];
          responseObject = { ...responseObject, ...rest }
        });
        // console.log(responseObject);
        const screenShotSecs = screenShotSeconds;
        let transcription = '';
        for (let i = 0; i < filesCount; i++) {
          transcription += ` ${responseObject[i]}`;
        }
        transcription = transcription.trim(); */
        // const { transcription, screenShotSecs } = await speechToText(flacFilePath);
        const { transcription, screenShotSecs } = await speechToTextWithStream(flacFilePath, 'transcription');
        console.log(transcription);
        console.log(screenShotSecs);
        if (screenShotSecs.length) {
          await takeScreenShot(filePath, screenShotSecs);
        }
        // const transcription = "instruction title is  perform for checks on gas Forklift  step 1  Pak Forklift  instruction number one ensure your Forklift is parked safely on level ground and the park brake is engaged  number to open outdoors  number 3 lift seat to access engine and prop it up  warning number 1  do not remove radiator cap  number to crush if Forklift roles number 3 burns if coolant checked while engine oil Eid hot  reaction plan  Pak on level ground  hint  avoid contact  where gloves when refuelling  step 2  check level of engine oil  instruction  number 1 full voot dip stick number 2  wipe with a cloth or paper  number 3  Re insert dip stick all the way and pull out again number four check if oil between two markers on end of stick number 5 if insufficient oil notified to check for oil leaks  step 3 check coolant level  instruction  number 1  check level of coolant in overflow bottle number to check for any visible water leaks  number three if coolant level is below mark top up with water  warning number 1 do not remove radiator cap";
        const { instruction, steps } = await createWorkInstruction(transcription, userDetails);
        console.log(instruction);
        console.log(steps);
        const { WI_Name } = instruction;
        res.status(200).json({ fileName, transcription, WI_Name });
      } catch ( error ) {
        console.log(error);
        res.status(500).send({ status: 500, message: error.message, error: error.error });
      }
    }
  });
  return speechToTextConverterRouter;
}

module.exports = router;
