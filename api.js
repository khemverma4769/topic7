const express = require('express');
const mongoose = require('mongoose');
const Device = require('./models/device');


mongoose.connect('mongodb+srv://amrit1254:Rijju1234@cluster0.mtbkfpu.mongodb.net/mydb', { useNewUrlParser: true, useUnifiedTopology: true });
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
const port = 5000;

app.use(express.static(`${__dirname}/public/generated-docs`));

app.get('/docs', (req, res) => {
  res.sendFile(`${__dirname}/public/generated-docs/index.html`);
});

// Define an HTTP GET route on '/api/test'
app.get('/api/test', (req, res) => {
  // Send a simple string response to the client
  res.send('The API is working!');
});

/**
* @api {get} /api/devices AllDevices An array of all devices
* @apiGroup Device
* @apiSuccessExample {json} Success-Response:
*  [
*    {
*      "_id": "dsohsdohsdofhsofhosfhsofh",
*      "name": "Mary's iPhone",
*      "user": "mary",
*      "sensorData": [
*        {
*          "ts": "1529542230",
*          "temp": 12,
*          "loc": {
*            "lat": -37.84674,
*            "lon": 145.115113
*          }
*        },
*        {
*          "ts": "1529572230",
*          "temp": 17,
*          "loc": {
*            "lat": -37.850026,
*            "lon": 145.117683
*          }
*        }
*      ]
*    }
*  ]
* @apiErrorExample {json} Error-Response:
*  {
*    "User does not exist"
*  }
*/


// Define an HTTP GET route on '/api/devices'
app.get('/api/devices', (req, res) => {
  // Use the 'Device' model to retrieve all devices from the database
  Device.find({}, (err, devices) => {
    // If there is an error, send the error response to the client
    if (err == true) {
      return res.send(err);
    } else {
      // If there are no errors, send the retrieved devices as the response
      return res.send(devices);
    }
  });
});


// This code defines a route to handle a POST request to create a new device with sensor data
app.post('/api/devices', (req, res) => {

  // This code extracts the relevant information from the request body, including the device name, user, and sensor data
  const { name, user, sensorData } = req.body;

  // This code creates a new Device object with the extracted information
  const newDevice = new Device({
    name,
    user,
    sensorData
  });

  // This code saves the new device to the database and returns an appropriate response depending on whether there was an error
  newDevice.save(err => {
    return err
      ? res.send(err)
      : res.send('successfully added device and data');
  });
});

// This code starts the server and listens for incoming HTTP requests on the specified port
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
