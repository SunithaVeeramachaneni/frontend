const express = require('express');
const fs = require('fs');
const multer = require('multer');
const speechToTextConverterRouter = express.Router();
// Imports the Google Cloud client library
const speech = require('@google-cloud/speech').v1p1beta1;
const sox = require('sox');
const ffmpeg = require('fluent-ffmpeg');
const logger = require("./logger");
const constants = require("./constants");
const Instruction = require('./models/instruction.model');
const Step = require('./models/step.model');
const dirName = 'AudioOrVideoFiles';

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

// Creates a client
const client = new speech.SpeechClient();

async function quickstart(filename) {
  console.log(filename);
  // The path to the remote LINEAR16 file
  const gcsUri = 'gs://cloud-samples-data/speech/brooklyn_bridge.raw';

  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    // uri: gcsUri,
    content: fs.readFileSync(`./${dirName}/${filename}`).toString('base64'),
  };

  const config = {
    encoding: 'FLAC',
    // sampleRateHertz: 16000,
    languageCode: 'en-US',
    // useEnhanced: true
  };
  const request = {
    audio: audio,
    config: config,
  };

  try {
    // Detects speech in the audio file
    const [response] = await client.recognize(request);
    console.log(response);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log(`Transcription: ${transcription}`);
  } catch (error) {
    console.log(error);
  }
}
// quickstart();

const speechToTextOld = filename => {
  return new Promise((resolve, reject) => {
    const audio = {
      content: fs.readFileSync(`./${dirName}/${filename}`).toString('base64'),
    };
    const config = {
      encoding: 'FLAC',
      languageCode: 'en-US',
    };
    const request = {
      audio,
      config
    };

    const result = async () => {
      try {
        // Detects speech in the audio file
        const [response] = await client.recognize(request);
        console.log(response);
        const transcription = response.results
          .map(result => {
            logger.logger1.info(result.alternatives);
            return result.alternatives[0].transcript
          })
          .join('\n');
        logger.logger1.info(`Transcription: ${transcription}`);
        resolve({ transcription });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    }
    result();
  })
}

const speechToText = filename => {
  return new Promise((resolve, reject) => {
    const audio = {
      content: fs.readFileSync(`./${dirName}/${filename}`).toString('base64'),
    };
    const config = {
      encoding: 'FLAC',
      languageCode: 'en-US',
    };
    const request = {
      audio,
      config
    };

    const result = async () => {
      try {
        // Detects speech in the audio file
        const [operation] = await client.longRunningRecognize(request);
        // Get a Promise representation of the final result of the job
        const [response] = await operation.promise();
        console.log(response);
        const transcription = response.results
          .map(result => {
            logger.logger1.info(result.alternatives);
            return result.alternatives[0].transcript
          })
          .join('\n');
        logger.logger1.info(`Transcription: ${transcription}`);
        resolve({ transcription });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    }
    result();
  })
}

const speechToTextWithStream = (filepath, key) => {
  return new Promise((resolve, reject) => {
    const config = {
      encoding: 'FLAC',
      sampleRateHertz: 44100,
      languageCode: 'en-IN',
      enableAutomaticPunctuation: true,
      // alternativeLanguageCodes: ['en-IN', 'en-US']
    };
    const request = {
      config,
      interimResults: false, // If you want interim results, set this to true
    };

    let transcription = [];
    // Stream the audio to the Google Cloud Speech API
    const recognizeStream = client
      .streamingRecognize(request)
      .on('error', reject)
      .on('data', data => {
        // console.log(data.results[0]);
        /* console.log(
          `Transcription: ${data.results[0].alternatives[0].transcript}`
        ); */
        transcription = [...transcription, data.results[0].alternatives[0].transcript];
      })
      .on('end', () => {
        resolve({ [key]:  transcription.join(' ') });
      });

    // Stream an audio file from disk to the Speech API, e.g. "./resources/audio.raw"
    fs.createReadStream(filepath).pipe(recognizeStream);
  })
}

const speechToTextWithTimeInfo = (filename) => {
  let avgSecs = [];
  return new Promise((resolve, reject) => {
    const audio = {
      content: fs.readFileSync(`./${dirName}/${filename}`).toString('base64'),
    };
    const config = {
      enableWordTimeOffsets: true,
      encoding: 'FLAC',
      languageCode: 'en-US',
    };
    const request = {
      audio,
      config
    };

    const result = async () => {
      let startTime, endTime;
      try {
        // Detects speech in the audio file. This creates a recognition job that you
        // can wait for now, or get its result later.
        const [operation] = await client.longRunningRecognize(request);

        // Get a Promise representation of the final result of the job
        const [response] = await operation.promise();
        console.log(response);
        const transcription = response.results
          .map(result => {
            logger.logger1.info(result.alternatives);
            result.alternatives[0].words.forEach(wordInfo => {
              // NOTE: If you have a time offset exceeding 2^32 seconds, use the
              // wordInfo.{x}Time.seconds.high to calculate seconds.
              const startSecs =
                `${wordInfo.startTime.seconds}` +
                '.' +
                wordInfo.startTime.nanos / 100000000;
              const endSecs =
                `${wordInfo.endTime.seconds}` +
                '.' +
                wordInfo.endTime.nanos / 100000000;
              if (wordInfo.word === 'much') {
                startTime = startSecs;
                logger.logger1.info(`Word: ${wordInfo.word}`);
                logger.logger1.info(`\t ${startSecs} secs - ${endSecs} secs`);
              }
              if (wordInfo.word === 'better') {
                logger.logger1.info(`Word: ${wordInfo.word}`);
                logger.logger1.info(`\t ${startSecs} secs - ${endSecs} secs`);
                endTime = endSecs;
                avgSecs = [...avgSecs, parseFloat(((parseFloat(startTime) + parseFloat(endTime)) / 2).toFixed(1))];
                console.log(avgSecs);
                console.log(startTime);
                console.log(endTime);
              }
            });
            return result.alternatives[0].transcript
          })
          .join('\n');
        logger.logger1.info(`Transcription: ${transcription}`);
        resolve({ transcription, avgSecs });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    }
    result();
  })
}

const convertWavToFlac = filename => {
  return new Promise((resolve, reject) => {
    sox.identify(`./${dirName}/${filename}`, function(err, results) {
      console.log(results);
    })
    const fileDetails = filename.split('.');
    const flacName = `${fileDetails[0]}.flac`;
    const toFlac = sox.transcode(`./${dirName}/${filename}`, `./${dirName}/${flacName}`, {
      format: 'FLAC',
      channelCount: 1,
      compressionQuality: -192
    });
    toFlac.on('error', function(error) {
      reject(error);
    });
    toFlac.on('end', () => {
      resolve({ filename: flacName });
    });
    toFlac.start();
  })
}

const convert = (input, output, callback) => {
  ffmpeg(input)
      .output(output)
      .audioChannels(1)
      .on('end', function() {
          console.log('conversion ended');
          callback(null);
      }).on('error', function(err){
        console.log(err);
          console.log('error: ', err.code, err.msg);
          callback(err);
      }).run();
}

const convertToFlac = filename => {
  return new Promise((resolve, reject) => {
    const fileDetails = filename.split('.');
    const flacName = `${fileDetails[0]}.flac`;
    const input =  `./${dirName}/${filename}`;
    const output =  `./${dirName}/${flacName}`;
    /* ffmpeg.ffprobe(input, function(err, metadata) {
      console.log(metadata);
    }); */
    ffmpeg(input)
        .output(output)
        .audioChannels(1)
        .audioFrequency(44100)
        /* .screenshots({
          // Will take screens at 20%, 40%, 60% and 80% of the video
          count: 4,
          folder: `${dirName}/images`
        }) */
        .on('end', function() {
          /* ffmpeg.ffprobe(output, function(err, metadata) {
            console.log(metadata);
          }); */
          resolve({ filename: flacName });
        }).on('error', function(error){
          console.log(error);
          console.log('error: ', error.code, error.msg);
          reject(error);
        }).run();
  });
}

const splitIntoMultipleFiles = filename => {
  return new Promise((resolve, reject) => {
    let promises = [];
    const file = filename.split('.');
    const folderPath = `./${dirName}/${file[0]}`;
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    const input =  `./${dirName}/${filename}`;
    ffmpeg.ffprobe(input, async function(err, metadata) {
      const { format: { duration } } = metadata;
      console.log(duration);
      const fileDuration = 60;
      for (let i = 0; i < Math.ceil(duration/fileDuration) ; i++ ) {
        const { hours, minutes, seconds } = secondsToHms(i * fileDuration);
        const seekInput = `${hours}:${minutes}:${seconds}`;
        const output = `./${dirName}/${file[0]}/${i}.flac`;
        promises = [
          ...promises,
          splitFile(input, seekInput, output, fileDuration)
        ]
      }
      try {
        await Promise.all(promises);
        resolve({ success: true, folderPath, filesCount: Math.ceil(duration/fileDuration) });
      } catch (error) {
        reject(error);
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
        reject(error);
      })
      .run();
  });
}

const secondsToHms = s => ({
  hours: ((s - s % 3600) / 3600) % 60,
  minutes: ((s - s % 60) / 60) % 60,
  seconds: s % 60
})

const convertToWav = filename => {
  return new Promise((resolve, reject) => {
    const fileDetails = filename.split('.');
    const flacName = `${fileDetails[0]}.wav`;
    const input =  `./${dirName}/${filename}`;
    const output =  `./${dirName}/${flacName}`;
    /* ffmpeg.ffprobe(input, function(err, metadata) {
      console.log(metadata);
    }); */
    ffmpeg(input)
        .output(output)
        .audioChannels(1)
        .audioFrequency(16000)
        .on('end', function() {
          /* ffmpeg.ffprobe(output, function(err, metadata) {
            console.log(metadata);
          }); */
          resolve({ filename: flacName });
        }).on('error', function(error){
          console.log(error);
          console.log('error: ', error.code, error.msg);
          reject(error);
        }).run();
  });
}

const takeScreenShot = (filename, secs) => {
  return new Promise((resolve, reject) => {
    const input =  `./${dirName}/${filename}`;
    /* ffmpeg.ffprobe(input, function(err, metadata) {
      console.log(metadata);
    }); */
    ffmpeg(input)
        .screenshots({
          timestamps: [...secs],
          folder: `${dirName}/images`
        })
        .on('end', function() {
          /* ffmpeg.ffprobe(output, function(err, metadata) {
            console.log(metadata);
          }); */
          resolve({ screenshot: 'success' });
        }).on('error', function(error){
          console.log(error);
          console.log('error: ', error.code, error.msg);
          reject(error);
        });
  });
}

/* convert(`./${dirName}/1280.mp4`, `./${dirName}/1280.flac`, function(err){
  if(!err) {
    console.log('conversion complete');
  }
}); */

const createWorkInstruction = (message, userDetails) => {
  const { first_name = 'Test', last_name = 'User' } = userDetails || {};
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

      instruction.save()
        .then(result => {
          console.log(result);
          const { _id: WI_Id } = result
          createSteps(stepTitles, stepIns, stepWarn, stepHint, stepRPlan, WI_Id);
          resolve(result);
        }).catch(error => {
          reject(error);
        });
    } else {
      reject({ message: 'transcription is not valid', transcription: message });
    }
  });
}

const createSteps = (stepTitles, stepIns, stepWarn, stepHint, stepRPlan, WI_Id) => {
  stepTitles.forEach(async (value, index) => {
    if (value) {
      const instructions = stepIns[index] ? instructionObject(stepIns[index].trim(), 'Instruction') : null
      const warnings = stepWarn[index] ? instructionObject(stepWarn[index].trim(), 'Warning') : null
      const hints = stepHint[index] ? instructionObject(stepHint[index].trim(), 'Hint') : null
      const reactionPlan = stepRPlan[index] ? instructionObject(stepRPlan[index].trim(), 'Reaction Plan') : null
      const fields = fieldsObject(
        stepIns[index],
        stepWarn[index],
        stepHint[index],
        stepRPlan[index],
        null
      )
      const step = new Step({
        WI_Id,
        Title: value,
        Fields: fields,
        Instructions: instructions,
        Warnings: warnings,
        Hints: hints,
        Reaction_Plan: reactionPlan,
        Description: null,
        Status: null,
        Attachment: null,
        isCloned: false,
        Published: false
      });

      try {
        const result = await step.save();
        console.log(result);
      } catch (error) {
        console.log(error);
      }

      /* step.save()
        .then(result => {
          console.log(result);
        }).catch(error => {
          console.log(error);
        }); */
    }
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
      const result = matchData(message, extractFor, step, startPossibilities, endPossibilities) || [];
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
      const userDetails = req.body.userDetails ? JSON.parse(req.body.userDetails) : {};
      // quickstart(fileName);
      try {
        // const { filename: wavFileName } = await convertToWav(fileName);
        // const { filename } = await convertWavToFlac(wavFileName);
        // const { filename } = await convertWavToFlac(fileName);
        const { filename } = await convertToFlac(fileName);
        /* const { folderPath, filesCount } = await splitIntoMultipleFiles(fileName);
        let promises = [];
        for (let i = 0; i < filesCount; i++) {
          promises = [
            ...promises,
            speechToTextWithStream(`${folderPath}/${i}.flac`, i)
          ];
        }
        const response = await Promise.all(promises);
        let responseObject = {};
        response.forEach(value => {
          responseObject = { ...responseObject, ...value }
        });
        console.log(responseObject);
        let combinedTranscription = '';
        for (let i = 0; i < filesCount; i++) {
          combinedTranscription += ` ${responseObject[i]}`;
        }
        combinedTranscription = combinedTranscription.trim();
        console.log(combinedTranscription); */
        // const { transcription } = await speechToText(filename);
        const { transcription } = await speechToTextWithStream(`./${dirName}/${filename}`, 'transcription');
        console.log(transcription);
        /* const { transcription, avgSecs } = await speechToTextWithTimeInfo(filename);
        if (avgSecs.length) {
          await takeScreenShot(fileName, avgSecs);
        } */
        // const transcription = 'create new work instruction with name sample work instruction';
        // const transcription = "instruction title is equipment specific lockout tagout procedure step one title is notify instruction notifying all affected employees that servicing or maintenance is required on a mission or equipment and that emission or equipment must be shut down and locked out to perform the servicing or maintenance step 2 title is review lockout procedure instruction the authorized employee shall refer to the fence lock out procedure to identify the type and magnitude of the energy or equipment utilizes understand the hazards of the energy and she'll know the methods to control the energy step 3 title is perform Mission stop instruction if the mission or equipment is operating shut it down by the normal stopping procedures like the press the stop button open switch close ball stop";
        // const transcription = "Instruction title is equipment specific lock out tag out procedure step 1 title, IX notify instruction notify all affected employees that servicing or maintenance is required on a mission or equipment and that the nation or equipment must be shut down and logged out to perform the servicing or maintenance step to try to leave a review Lockout procedure instruction. The authorised employees shall refer to the pens Lockout procedure to identify the type and magnitude of the energy that the machine or equipment utilizes understand the hazards of the energy and shall know the methods to control the energy. Step 3 title Aise perform machine stop instruction if the machine or equipment is operating shut it down by the normal stopping procedure.  Like depress the stop button opens which close bol excetra we can repair operating procedure for normal shutdown.  Stop."
        // const transcription = "instruction title is  perform for checks on gas Forklift  step 1  Pak Forklift  instruction number one ensure your Forklift is parked safely on level ground and the park brake is engaged  number to open outdoors  number 3 lift seat to access engine and prop it up  warning number 1  do not remove radiator cap  number to crush if Forklift roles number 3 burns if coolant checked while engine oil Eid hot  reaction plan  Pak on level ground  hint  avoid contact  where gloves when refuelling  step 2  check level of engine oil  instruction  number 1 full voot dip stick number 2  wipe with a cloth or paper  number 3  Re insert dip stick all the way and pull out again number four check if oil between two markers on end of stick number 5 if insufficient oil notified to check for oil leaks  step 3 check coolant level  instruction  number 1  check level of coolant in overflow bottle number to check for any visible water leaks  number three if coolant level is below mark top up with water  warning number 1 do not remove radiator cap";
        const { _id: Id, WI_Name } = await createWorkInstruction(transcription, userDetails);
        res.status(200).json({ fileName, transcription, WI_Name, Id });
      } catch ( error ) {
        console.log(error);
        res.status(500).send({ status: 500, message: error.stderr ? error.stderr : error.msg ? error.msg : error.message? error.message : error, error });
      }
    }
  });
  return speechToTextConverterRouter;
}

module.exports = router;
