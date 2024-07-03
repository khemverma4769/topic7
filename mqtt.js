const mqtt = require('mqtt');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Device = require('./models/device');
mongoose.connect('mongodb+srv://amrit1254:Rijju1234@cluster0.mtbkfpu.mongodb.net/mydb', { useNewUrlParser: true, useUnifiedTopology: true });
const randomCoordinates = require('random-coordinates');

const app = express();
app.use(express.static('public'));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const port = 5001;

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({
    extended: true
}));

const client = mqtt.connect("mqtt://broker.hivemq.com:1883");
const newCoords = randomCoordinates(); /* returns a string with a long and lat */
const coordsArray = newCoords.split(", "); /* returns an array with the two values */
const lat = coordsArray[0];
const lon = coordsArray[1];

client.on('message', (topic, message) => {
    if (topic == '/sensorData') {
      const data = JSON.parse(message);
  
      Device.findOne({"name": data.deviceId }, (err, device) => {
        if (err) {
          console.log(err)
        }
  
        const { sensorData } = device;
        const { ts, loc, temp } = data;
  
        sensorData.push({ ts, loc, temp });
        device.sensorData = sensorData;
  
        device.save(err => {
          if (err) {
            console.log(err)
          }
        });
      });
    }
  });

client.on('connect', () => { 
    client.subscribe('/sensorData');
    console.log('mqtt connected');
});

app.post('/send-command', (req, res) => {
    const { deviceId, command }  = req.body;
    const topic = `/myid/command/${deviceId}`;
    client.publish(topic, command, () => {
      res.send('published new message');
    });
  });

  app.put('/sensor-data', (req, res) => {
    const { deviceId }  = req.body;
  
    const [lat, lon] = randomCoordinates().split(", ");
    const ts = new Date().getTime();
    const loc = { lat, lon };
    min = Math.ceil(20);
    max = Math.floor(50);
    temp = Math.floor(Math.random() * (max - min + 1) + min);
  
    const topic = `/sensorData`;
    const message = JSON.stringify({ deviceId, ts, loc, temp });
  
    client.publish(topic, message, () => {
      res.send('published new message');
    });
  });
  
app.listen(port, () => { 
    console.log(`listening on port ${port}`);
});