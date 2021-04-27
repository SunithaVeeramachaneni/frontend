const express = require('express');
const cors = require('cors');
const app = express();
var bodyParser = require('body-parser')
let base64 = require('base-64');
var request = require('request');
var session = require('express-session');
const conntimeout = require('connect-timeout');
var separateReqPool = {maxSockets: 10};
var sessionOptions = {
    secret: '1234',
    cookie: {
        maxAge: 269999999999
    },
    saveUninitialized: true,
    resave: true
};
app.use(conntimeout('60s'))
app.use(session(sessionOptions));
app.use(haltOnTimedout);
app.use(bodyParser.json({limit: '200mb'}));
app.use(haltOnTimedout);
let router = express.Router();

const getTime = (currentTime) => {
	let YYYY = currentTime.getFullYear();
	let MM = currentTime.getMonth()+1;
	let DD = currentTime.getDate();
	let hh = currentTime.getHours();
	let mm = currentTime.getMinutes();
	let ss = currentTime.getSeconds();
	let ms = currentTime.getMilliseconds();

	DD = DD < 10 ? `0${DD}`: DD;
	MM = MM < 10 ? `0${MM}`: MM;
	hh = hh < 10 ? `0${hh}`: hh;
	mm = mm < 10 ? `0${mm}`: mm;
	ss = ss < 10 ? `0${ss}`: ss;

    return `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}.${ms}`;
}

const timeout = 60000;
const csrfTokenExpireTime = 29 // mins

//http://10.0.0.23:8002 - Private IP - NG5
//52.71.95.255 - Public IP - NG5

//http://10.0.0.105:8000 - Private IP - NGT
//54.208.252.183 - - Public IP - NGT

// var baseUrl = 'http://52.71.95.255:8002/sap/opu/odata/INVCEC/RACE_SRV/';
var baseUrl = 'http://54.208.252.183:8000/sap/opu/odata/INVCEC/RACE_SRV/';     // For NGT System
// var baseUrl = 'http://54.208.180.228:8000/sap/opu/odata/INVCEC/RACE_SRV/';      // For NGQ System


let reqHeaders = {
    "Authorization": "Basic " + base64.encode('MWORKINST1' + ':' + 'qwerty'),         //Credentilas for NGT System
    // "Authorization": "Basic " + base64.encode('gurpreet.wo' + ':' + 'qa@54321'),      //Credentilas for NGQ System
    "Content-Type": "application/json",
    "x-csrf-token": "Fetch"
}

const getReqHeaders = { ...reqHeaders };
const postReqHeaders = { ...reqHeaders, 'x-csrf-token': '' };

app.use(router);
app.use(haltOnTimedout);
app.use(cors());
app.use(haltOnTimedout);

function haltOnTimedout (req, res, next) {
  if (!req.timedout) next()
}

const getCSRFToken = (res = null) => {
  return new Promise((resolve, reject) => {
    const url = baseUrl + 'DFormCollection?$format=json';
    request({
      url,
      pool: separateReqPool,
      headers: getReqHeaders,
      timeout
    }, function (error, response) {
      if (error) {
        postReqHeaders['x-csrf-token'] = '';
        postReqHeaders['Cookie'] = '';
        if (res !== null) {
          res.status(500).json({ status: 500, message: 'Unable to set CSRF Token', error });
        }
        reject({ error });
      } else {
        postReqHeaders['x-csrf-token'] = response.headers['x-csrf-token'];
        postReqHeaders['Cookie'] = response.headers["set-cookie"];
        console.log(`${getTime(new Date())} : getCSRFToken : CSRF Token Set/Reset`);
        resolve({ response });
      }
    })
  })
}

const setReqHeaders = ({ req, postRequestHeaders }) => {
  req.session.headers = {};
  req.session.headers.cookie = postRequestHeaders['Cookie'];
  req.session.headers.csrf = postRequestHeaders['x-csrf-token'];
}

const getErrorResponseFormat = (status, data) => {
  const { message } = data.error;
  const { value } = message;
  return { status, message: value, error: data };
}

setInterval(async () => {
  try {
    await getCSRFToken();
  } catch (error) {
    console.log(`${getTime(new Date())} : getCSRFToken : Unable to set CSRF Token : ${JSON.stringify(error)}`);
  }
}, 1000 * 60 * csrfTokenExpireTime)

app.get('/businessObjects', (req, res) => {
  let url = baseUrl + 'WIOBJECTCATEGORYCollection' + '?$format=json&' + '$filter=APPNAME%20eq%20%27MWORKORDER%27'
  console.log(`${getTime(new Date())} : businessObjects : ${url}`);
  request({
    url: url,
    pool: separateReqPool,
    headers: getReqHeaders,
    timeout
  }, function (error, response) {
    if (error) {
      if (!req.timedout) {
        res.status(500).json({ status: 500, message: 'Unable to get business objects!', error });
      }
      console.log(`${getTime(new Date())} : businessObjects : ${error}`);
    }
    if (!error) {
      console.log(`${getTime(new Date())} : businessObjects : ${response.statusCode}`);
      if (!req.timedout && response.statusCode === 200) {
        res.status(200).json(JSON.parse(response.body).d.results);
      } else if (!req.timedout) {
        res.status(response.statusCode).json(getErrorResponseFormat(response.statusCode, response.body));
      } else {
        console.log(`${getTime(new Date())} : businessObjects : ServiceUnavailableError: Response timeout`);
      }
    }
  });
});

app.get('/publishedInstructions', (req, res) => {
  let modUrl = baseUrl + 'DFormListCollection' + '?$format=json&' + '$filter=APPNAME%20eq%20%27MWORKORDER%27%20and%20WINSTRIND%20eq%20%27X%27'
  console.log(`${getTime(new Date())} : publishedInstructions : ${modUrl}`);
  request({
      url: modUrl,
      pool: separateReqPool,
      headers: getReqHeaders,
      timeout
  }, function (error, response) {
      if (error) {
        if (!req.timedout) {
          res.status(500).json({ status: 500, message: 'Unable to get published Work Instructions!', error });
        }
        console.log(`${getTime(new Date())} : publishedInstructions : ${error}`);
      }
      if (!error) {
          console.log(`${getTime(new Date())} : publishedInstructions : ${response.statusCode}`);
          if (!req.timedout && response.statusCode === 200) {
            res.status(200).json(JSON.parse(response.body).d.results);
          } else if (!req.timedout) {
            res.status(response.statusCode).json(getErrorResponseFormat(response.statusCode, response.body));
          } else {
            console.log(`${getTime(new Date())} : businessObjects : ServiceUnavailableError: Response timeout`);
          }
      }
  });
})

app.get('/publishedInstructionsByName', (req, res) => {
  let url = baseUrl + 'DFormListCollection?$format=json&' + '$filter=APPNAME' + '%20eq%20%27' + req.query.APPNAME + '%27%20' + 'and%20' + 'FORMNAME' + '%20eq%20%27' + req.query.FORMNAME + '%27%20and%20' + 'WINSTRIND' + '%20eq%20%27' + req.query.WINSTRIND + '%27'
  console.log(`${getTime(new Date())} : publishedInstructionsByName : ${url}`);
  request({
      url: url,
      pool: separateReqPool,
      headers: getReqHeaders,
      timeout
  }, function (error, response) {
      if (error) {
        if (!req.timedout) {
          res.status(500).json({ status: 500, message: 'Unable to get published Work Instructions!', error });
        }
        console.log(`${getTime(new Date())} : publishedInstructionsByName : ${error}`);
      }
      if (!error) {
          console.log(`${getTime(new Date())} : publishedInstructionsByName : ${response.statusCode}`);
          if (!req.timedout && response.statusCode === 200) {
            res.status(200).json(JSON.parse(response.body).d.results);
          } else if (!req.timedout) {
            res.status(response.statusCode).json(getErrorResponseFormat(response.statusCode, response.body));
          } else {
            console.log(`${getTime(new Date())} : publishedInstructionsByName : ServiceUnavailableError: Response timeout`);
          }
      }
  });
})

app.put('/removeInstruction', async function (req, res) {
  if (!postReqHeaders['x-csrf-token']) {
    try {
      await getCSRFToken(res);
    } catch (error) {
      console.log(`${getTime(new Date())} : getCSRFToken : Unable to set CSRF Token : ${JSON.stringify(error)}`);
    }
  }

  if (postReqHeaders['x-csrf-token']) {
    var PutUrl = baseUrl + 'DFormListCollection'+'(' + 'APPNAME=' + "'" + req.body.APPNAME + "'" + ',FORMNAME=' + "'" + req.body.FORMNAME + "'" + ',VERSION=' + "'" + req.body.VERSION + "'" + ')';
    var entity = {
      "APPNAME":req.body.APPNAME,
      "FORMNAME":req.body.FORMNAME,
      "DELIND": req.body.DELIND,
      "WINSTRIND":req.body.WINSTRIND
    }

    let options = {
      url: PutUrl,
      method: 'PUT',
      headers: postReqHeaders,
      body: entity,
      json: true,
      timeout
    };
    console.log(`${getTime(new Date())} : removeInstruction : ${PutUrl}`);
    request(options, function (error, response) {
      if (error) {
        if (!req.timedout) {
          res.status(500).json({ status: 500, message: 'Unable to delete published Work Instruction!', error });
        }
        console.log(`${getTime(new Date())} : removeInstruction : ${error}`);
      }
      if (!error) {
        console.log(`${getTime(new Date())} : removeInstruction : ${response.statusCode}`);
        if (!req.timedout && response.statusCode === 204) {
          res.status(204).send();
        } else if (!req.timedout) {
          res.status(response.statusCode).json(getErrorResponseFormat(response.statusCode, response.body));
        } else {
          console.log(`${getTime(new Date())} : removeInstruction : ServiceUnavailableError: Response timeout`);
        }
      }
    });
  }
});

app.put('/removeStep', async function (req, res) {
  if (!postReqHeaders['x-csrf-token']) {
    try {
      await getCSRFToken(res);
    } catch (error) {
      console.log(`${getTime(new Date())} : getCSRFToken : Unable to set CSRF Token : ${JSON.stringify(error)}`);
    }
  }

  if (postReqHeaders['x-csrf-token']) {
    var PutUrl = baseUrl + 'DFormCollection'+'(' + 'APPNAME=' + "'" + req.body.APPNAME + "'" + ',VALIDFROM=' + "'" + 20201005135512 + "'" + ',VALIDTO=' + "'" + 99991230183000 + "'" + ',FORMNAME=' + "'" + req.body.FORMNAME + "'" + ',VERSION=' + "'" + "001" + "'" + ',UNIQUEKEY=' + "'" + req.body.UNIQUEKEY + "'" + ')';
    var entity = {
      "APPNAME":req.body.APPNAME,
      "FORMNAME":req.body.FORMNAME,
      "UNIQUEKEY": req.body.UNIQUEKEY,
      "STEPS": req.body.STEPS,
      "WINSTRIND":req.body.WINSTRIND,
      "DELIND":req.body.DELIND
    }

    let options = {
      url: PutUrl,
      method: 'PUT',
      headers: postReqHeaders,
      body: entity,
      json: true,
      timeout
    };
    console.log(`${getTime(new Date())} : removeStep : ${PutUrl}`);
    request(options, function (error, response) {
      if (error) {
        if (!req.timedout) {
          res.status(500).json({ status: 500, message: 'Unable to delete published Step!', error });
        }
        console.log(`${getTime(new Date())} : removeStep : ${error}`);
      }
      if (!error) {
        console.log(`${getTime(new Date())} : removeStep : ${response.statusCode}`);
        if (!req.timedout && response.statusCode === 204) {
          res.status(204).send();
        } else if (!req.timedout) {
          res.status(response.statusCode).json(getErrorResponseFormat(response.statusCode, response.body));
        } else {
          console.log(`${getTime(new Date())} : removeStep : ServiceUnavailableError: Response timeout`);
        }
      }
    });
  }
});

app.get('/getSteps', function (req, res) {
  var GetUrl = baseUrl + 'DFormListCollection'+'(' + 'APPNAME=' + "'" + req.query.APPNAME + "'" + ',FORMNAME=' + "'" + req.query.FORMNAME + "'" + ',VERSION=' + "'" + "001" + "'" + ')/DFormSet?$format=json';
  console.log(`${getTime(new Date())} : getSteps : ${GetUrl}`);
  request({
    url: GetUrl,
    pool: separateReqPool,
    headers: getReqHeaders,
    timeout
  }, function (error, response) {
    if (error) {
      if (!req.timedout) {
        res.status(500).json({ status: 500, message: 'Unable to get published Steps!', error });
      }
      console.log(`${getTime(new Date())} : getSteps : ${error}`);
    }
    if (!error) {
      console.log(`${getTime(new Date())} : getSteps : ${response.statusCode}`);
      if (!req.timedout && response.statusCode === 200) {
        res.status(200).json(JSON.parse(response.body).d.results)
      } else if (!req.timedout) {
        res.status(response.statusCode).json(getErrorResponseFormat(response.statusCode, response.body));
      } else {
        console.log(`${getTime(new Date())} : getSteps : ServiceUnavailableError: Response timeout`);
      }
    }
  });
});

app.get('/getStep', function (req, res) {
  var GetUrl = baseUrl + 'DFormCollection'+'(' + 'APPNAME=' + "'" + req.query.APPNAME + "'" + ',VALIDFROM=' + "'" + 20201005135512 + "'" + ',VALIDTO=' + "'" + 99991230183000 + "'" + ',FORMNAME=' + "'" + req.query.FORMNAME + "'" + ',VERSION=' + "'" + "001" + "'" + ',UNIQUEKEY=' + "'" + req.query.UNIQUEKEY + "'" + ')'+'?$format=json';
  console.log(`${getTime(new Date())} : getStep : ${GetUrl}`);
  request({
    url: GetUrl,
    pool: separateReqPool,
    headers: getReqHeaders,
    timeout
  }, function (error, response) {
    if (error) {
      if (!req.timedout) {
        res.status(500).json({ status: 500, message: 'Unable to get published Step!', error });
      }
      console.log(`${getTime(new Date())} : getStep : ${error}`);
    }
    if (!error) {
      console.log(`${getTime(new Date())} : getStep : ${response.statusCode}`);
      if (!req.timedout && response.statusCode === 200) {
        res.status(200).json(JSON.parse(response.body).d);
      } else if (!req.timedout) {
        res.status(response.statusCode).json(getErrorResponseFormat(response.statusCode, response.body));
      } else {
        console.log(`${getTime(new Date())} : getStep : ServiceUnavailableError: Response timeout`);
      }
    }
  });
});

app.post('/publishInstruction', async function (req, res) {
  if (!postReqHeaders['x-csrf-token']) {
    try {
      await getCSRFToken(res);
    } catch (error) {
      console.log(`${getTime(new Date())} : getCSRFToken : Unable to set CSRF Token : ${JSON.stringify(error)}`);
    }
  }

  if (postReqHeaders['x-csrf-token']) {
    setReqHeaders({ req, postRequestHeaders: postReqHeaders });
    let options = {
      url: baseUrl + 'DFormCollection',
      method: 'POST',
      headers: postReqHeaders,
      body: req.body,
      json: true,
      timeout
    }
    console.log(`${getTime(new Date())} : publishInstruction : ${baseUrl + 'DFormCollection'}`);
    request(options, function (error, response) {
      if (error) {
        if (!req.timedout) {
          res.status(500).json({ status: 500, message: 'Unable to publish Work Instruction!', error });
        }
        console.log(`${getTime(new Date())} : publishInstruction : ${error}`);
      }
      if (!error) {
        console.log(`${getTime(new Date())} : publishInstruction : ${response.statusCode}`);
        if (!req.timedout && response.statusCode === 201) {
          res.status(201).json({status: response.statusCode});
        } else if (!req.timedout) {
          res.status(response.statusCode).json(getErrorResponseFormat(response.statusCode, response.body));
        } else {
          console.log(`${getTime(new Date())} : publishInstruction : ServiceUnavailableError: Response timeout`);
        }
      }
    });
  }
})

app.put('/favouriteInstruction', async function (req, res) {
  if (!postReqHeaders['x-csrf-token']) {
    try {
      await getCSRFToken(res);
    } catch (error) {
      console.log(`${getTime(new Date())} : getCSRFToken : Unable to set CSRF Token : ${JSON.stringify(error)}`);
    }
  }

  if (postReqHeaders['x-csrf-token']) {
    var PutUrl = baseUrl + 'DFormListCollection'+'(' + 'APPNAME=' + "'" + req.body.APPNAME + "'" + ',FORMNAME=' + "'" + req.body.FORMNAME + "'" + ',VERSION=' + "'" + req.body.VERSION + "'" + ')';
    var entity = {

      "APPNAME":req.body.APPNAME,
      "FORMNAME":req.body.FORMNAME,
      "FORMTITLE":req.body.FORMTITLE,
      "FAVOURITE":req.body.FAVOURITE,
      "VERSION":req.body.VERSION,
      "WINSTRIND":req.body.WINSTRIND
    }

    let options = {
        url: PutUrl,
        method: 'PUT',
        headers: postReqHeaders,
        body: entity,
        json: true,
        timeout
    };
    console.log(`${getTime(new Date())} : favouriteInstruction : ${PutUrl}`);
    request(options, function (error, response) {
        if (error) {
          if (!req.timedout) {
            res.status(500).json({ status: 500, message: 'Unable to update published favourite!', error });
          }
          console.log(`${getTime(new Date())} : favouriteInstruction : ${error}`);
        }
        if (!error) {
          console.log(`${getTime(new Date())} : favouriteInstruction : ${response.statusCode}`);
          if (!req.timedout && response.statusCode === 204) {
            res.status(204).send();
          } else if (!req.timedout) {
            res.status(response.statusCode).json(getErrorResponseFormat(response.statusCode, response.body));
          } else {
            console.log(`${getTime(new Date())} : favouriteInstruction : ServiceUnavailableError: Response timeout`);
          }
        }
    });
  }
})

app.put('/updateInstruction', async function (req, res) {
  if (!postReqHeaders['x-csrf-token']) {
    try {
      await getCSRFToken(res);
    } catch (error) {
      console.log(`${getTime(new Date())} : getCSRFToken : Unable to set CSRF Token : ${JSON.stringify(error)}`);
    }
  }

  if (postReqHeaders['x-csrf-token']) {
    var PutUrl = baseUrl + 'DFormCollection'+'(' + 'APPNAME=' + "'" + req.body.APPNAME + "'" + ',VALIDFROM=' + "'" + 20201005135512 + "'" + ',VALIDTO=' + "'" + 99991230183000 + "'" + ',FORMNAME=' + "'" + req.body.FORMNAME + "'" + ',VERSION=' + "'" + req.body.VERSION + "'" + ',UNIQUEKEY=' + "'" + req.body.UNIQUEKEY + "'" + ')';
    let entity = {
      APPNAME: req.body.APPNAME,
      CATEGORY: req.body.CATEGORY,
      FORMNAME: req.body.FORMNAME,
      FORMTITLE: req.body.FORMTITLE,
      IMAGECONTENT: req.body.IMAGECONTENT,
      INSTRUCTION: req.body.INSTRUCTION,
      STEPS: req.body.STEPS,
      TOOLS: req.body.TOOLS,
      UNIQUEKEY: req.body.UNIQUEKEY,
      VERSION: req.body.VERSION,
      WIDETAILS: req.body.WIDETAILS,
      WINSTRIND: "X"
    }

    let options = {
      url: PutUrl,
      method: 'PUT',
      headers: postReqHeaders,
      body: entity,
      json: true,
      timeout
    };
    console.log(`${getTime(new Date())} : updateInstruction : ${PutUrl}`);
    request(options, function (error, response) {
      if (error) {
        if (!req.timedout) {
          res.status(500).json({ status: 500, message: 'Unable to update published Work Instruction!', error });
        }
        console.log(`${getTime(new Date())} : updateInstruction : ${error}`);
      }
      if (!error) {
        console.log(`${getTime(new Date())} : updateInstruction : ${response.statusCode}`);
        if (!req.timedout && response.statusCode === 204) {
          res.status(204).send();
        } else if (!req.timedout) {
          res.status(response.statusCode).json(getErrorResponseFormat(response.statusCode, response.body));
        } else {
          console.log(`${getTime(new Date())} : updateInstruction : ServiceUnavailableError: Response timeout`);
        }
      }
    });
  }
})

app.listen(4200, async () => {
  console.log('product server listening on port 4200');
  try {
    await getCSRFToken();
  } catch (error) {
    console.log(`${getTime(new Date())} : getCSRFToken : Unable to set CSRF Token : ${JSON.stringify(error)}`);
  }
});
