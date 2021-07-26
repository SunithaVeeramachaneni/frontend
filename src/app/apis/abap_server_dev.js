const express = require('express');
const cors = require('cors');
const app = express();
var bodyParser = require('body-parser')
let base64 = require('base-64');
var request = require('request');
var session = require('express-session');
const conntimeout = require('connect-timeout');
var separateReqPool = { maxSockets: 10 };
var port = 7002;
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
app.use(bodyParser.json({ limit: '200mb' }));
app.use(haltOnTimedout);
let router = express.Router();

const getTime = (currentTime) => {
  let YYYY = currentTime.getFullYear();
  let MM = currentTime.getMonth() + 1;
  let DD = currentTime.getDate();
  let hh = currentTime.getHours();
  let mm = currentTime.getMinutes();
  let ss = currentTime.getSeconds();
  let ms = currentTime.getMilliseconds();

  DD = DD < 10 ? `0${DD}` : DD;
  MM = MM < 10 ? `0${MM}` : MM;
  hh = hh < 10 ? `0${hh}` : hh;
  mm = mm < 10 ? `0${mm}` : mm;
  ss = ss < 10 ? `0${ss}` : ss;

  return `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}.${ms}`;
}

const timeout = 60000;
const csrfTokenExpireTime = 29 // mins



var baseUrl = 'http://innongwtst.internal.innovapptive.com:8000/sap/opu/odata/INVMWO/MWORKORDER_SRV/';      // For NGQ System

let reqHeaders = {
  //"Authorization": "Basic " + base64.encode('MWORKINST1' + ':' + 'qwerty'),         //Credentilas for NGT System
  // "Authorization": "Basic " + base64.encode('gurpreet.wo' + ':' + 'qa@54321'),      //Credentilas for NGQ System
  "Authorization": "Basic " + base64.encode('mworkorder1' + ':' + 'qwerty'),         //Credentilas for NDS System
  "Content-Type": "application/json",
  "x-csrf-token": "Fetch"
}

const getReqHeaders = { ...reqHeaders };
const postReqHeaders = { ...reqHeaders, 'x-csrf-token': '' };

app.use(router);
app.use(haltOnTimedout);
app.use(cors());
app.use(haltOnTimedout);

function haltOnTimedout(req, res, next) {
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


const getErrorResponseFormat = (status, data) => {
  const { message } = data.error || {};
  const { value } = message || {};
  return { status, message: value, error: data };
}

setInterval(async () => {
  try {
    await getCSRFToken();
  } catch (error) {
    console.log(`${getTime(new Date())} : getCSRFToken : Unable to set CSRF Token : ${JSON.stringify(error)}`);
  }
}, 1000 * 60 * csrfTokenExpireTime)

const getSelectOptions = () => {
  const selectOptionsList = ['PRIOK', 'PRIOKX', 'COLOUR', 'AUFNR', 'AUFTEXT', 'ARBPL', 'KTEXT', 'PARNR', 'STATUS', 'WorkOrderOperationSet']
  
  let selectOptions = '';
  if (selectOptionsList.length > 0) {
    selectOptions = '$select='
    selectOptionsList.forEach(option => {
     selectOptions = selectOptions + option + ','
    });
    selectOptions = selectOptions.slice(0, -1) + '&';
  }
  return selectOptions;
}


app.get('/abapapi/workOrdersAndOperations', (req, res) => {
  let url = baseUrl + `WorkOrdersCollection?$expand=WorkOrderOperationSet&` + getSelectOptions() + '$format=json&';

  console.log(`${getTime(new Date())} : workOrders : ${url}`);
  request({
    url: url,
    pool: separateReqPool,
    headers: getReqHeaders,
    timeout
  }, function (error, response) {
    if (error) {
      if (!req.timedout) {
        res.status(500).json({ status: 500, message: 'Unable to get work Orders!', error });
      }
      console.log(`${getTime(new Date())} : workOrders : ${error}`);
    }
    if (!error) {
      console.log(`${getTime(new Date())} : workOrders : ${response.statusCode}`);
      if (!req.timedout && response.statusCode === 200) {
        res.status(200).json(JSON.parse(response.body).d.results);
      } else if (!req.timedout) {
        res.status(response.statusCode).json(getErrorResponseFormat(response.statusCode, response.body));
      } else {
        console.log(`${getTime(new Date())} : workOrders : ServiceUnavailableError: Response timeout`);
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Server startred on port: ${port}`)
}
)

app.get('/', (req, res) => {
  console.log("Base route hit!");
  res.json({ success: true, msg: "Base route hit!" })
})

