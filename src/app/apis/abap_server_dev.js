const express = require('express');
const cors = require('cors');
const app = express();
var bodyParser = require('body-parser')
let base64 = require('base-64');
const fetch = require('node-fetch');
var session = require('express-session');
const conntimeout = require('connect-timeout');
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
// const csrfTokenExpireTime = 29 // mins



var baseUrlWorkOrder = 'http://innongwtst.internal.innovapptive.com:8000/sap/opu/odata/INVMWO/MWORKORDER_SRV/';      // For NGQ System
var baseUrlRace = 'http://innongwtst.internal.innovapptive.com:8000/sap/opu/odata/INVCEC/RACE_SRV/'




const reqHeaders = (base) => {

  let headers = {
    "Content-Type": "application/json",
    "x-csrf-token": "Fetch"
  }
  if (base === 'work_order')
    headers = { "Authorization": "Basic " + base64.encode('mworkorder1' + ':' + 'qwerty'), ...headers };       //Credentilas for NDS System
  //"Authorization": "Basic " + base64.encode('MWORKINST1' + ':' + 'qwerty'),         //Credentilas for NGT System
  // "Authorization": "Basic " + base64.encode('gurpreet.wo' + ':' + 'qa@54321'),      //Credentilas for NGQ System

  if (base === 'race')
    headers = { "Authorization": "Basic " + base64.encode('mworkorder1' + ':' + 'qwerty'), ...headers };

  return headers
}

const getReqHeaders = (base) => reqHeaders(base);
const postReqHeaders = (base) => {
  const headers = reqHeaders(base);
  return { ...reqHeaders(base), 'x-csrf-token': '' }
};

app.use(router);
app.use(haltOnTimedout);
app.use(cors());
app.use(haltOnTimedout);

function haltOnTimedout(req, res, next) {
  if (!req.timedout) next()
}


const getErrorResponseFormat = (status, data) => {
  const { message } = data.error || {};
  const { value } = message || {};
  return { status, message: value, error: data };
}

const getSelectOptions = () => {
  const selectOptionsList = ['PRIOK', 'PRIOKX', 'COLOUR', 'AUFNR', 'AUFTEXT', 'ARBPL', 'KTEXT', 'PARNR', 'WorkOrderOperationSet/STATUS', 'WorkOrderOperationSet/ARBEI', 'TXT04']

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
  let url = baseUrlWorkOrder + 'WorkOrdersCollection?' + '$expand=WorkOrderOperationSet&' + getSelectOptions() + '$format=json&';

  let isPaginated = !!req.query.pagination;
  let hasData = true;
  console.log('isPaginated', isPaginated)

  console.log(`${getTime(new Date())} : workOrders : ${url}`);
  while (hasData) {
    result = {};
    await request({
      url: url,
      pool: separateReqPool,
      headers: (getReqHeaders('work_order')),
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
          result = {
            ...result,
            ...response.body.d
          }
          if (result.hasOwnProperty('__next') && isPaginated === true) {
            console.log("In the if statement")
            continue;
          }
          else {
            hasData = false;
            console.log("In the else statement, the result is ", result)
            res.status(200).json(JSON.parse(result);
          }
        } else if (!req.timedout) {
          res.status(response.statusCode).json(getErrorResponseFormat(response.statusCode, response.body));
        } else {
          console.log(`${getTime(new Date())} : workOrders : ServiceUnavailableError: Response timeout`);
        }
      }
    });
  });

app.get('/abapapi/logOnUserDetails', (req, res) => {
  let url = baseUrlRace + `LogonUserDetailsCollection?` + '$format=json&';

  console.log(`${getTime(new Date())} : logOnDetails : ${url}`);
  request({
    url: url,
    pool: separateReqPool,
    headers: getReqHeaders('race'),
    timeout
  }, function (error, response) {
    if (error) {
      if (!req.timedout) {
        res.status(500).json({ status: 500, message: 'Unable to get log on details!!', error });
      }
      console.log(`${getTime(new Date())} : logOnDetails : ${error}`);
    }
    if (!error) {
      console.log(`${getTime(new Date())} : logOnDetails : ${response.statusCode}`);
      if (!req.timedout && response.statusCode === 200) {
        res.status(200).json(JSON.parse(response.body).d.results);
      } else if (!req.timedout) {
        res.status(response.statusCode).json(getErrorResponseFormat(response.statusCode, response.body));
      } else {
        console.log(`${getTime(new Date())} : logOnDetails : ServiceUnavailableError: Response timeout`);
      }
    }
  });
});



app.listen(port, () => {
  console.log(`Server startred on port: ${port}`)
}
)



