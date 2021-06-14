const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


// create express app
const app = express();
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json());

app.use(bodyParser.json({limit: '50mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))


const speechToTextConverterRouter = require('./speech-to-text-converter-latest')();
app.use('/cwpapi/speech-to-text', speechToTextConverterRouter);

app.post('/cwpapi/approvalmail', (req, res) => {
  transporter.sendMail(req.body, function (error) {
    if (error) {
      logger.error(error);
      res.status(500).json({ status: 500, message: 'Unable to sent approval email!', error });
    } else {
      res.status(201).json({
        data: 'success'
      });
    }
  });
});



// Configuring the database
const dbConfig = require('./database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(() => {
  console.log("Successfully connected to the database");
}).catch(err => {
  console.log('Could not connect to the database. Exiting now...', err);
  process.exit();
});

const router = express.Router();
const instRoutes = require('./routes/instruction.routes.js')(router, {});
const catRoutes = require('./routes/category.routes.js')(router, {});
const stepRoutes = require('./routes/step.routes.js')(router, {});
// const userRoutes =  require('./routes/user.routes.js')(router, {});
app.use('/cwpapi', instRoutes);
app.use('/cwpapi', catRoutes);
app.use('/cwpapi', stepRoutes);
// app.use('/cwpapi', userRoutes);
// listen for requests
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
