// const response = $.get('http://localhost:3001/devices');
// console.log(response);
const API_URL = 'http://localhost:5000/api';
const MQTT_URL = 'http://localhost:5001/send-command';
// devices.push({ user: "Mary", name: "Mary's iPhone" });
// devices.push({ user: "Alex", name: "Alex's Surface Pro" });
// devices.push({ user: "Mary", name: "Mary's MacBook" });
$('#navbar').load('navbar.html');
// const devices = localStorage.getItem('devices') || [];
//const devices = JSON.parse(localStorage.getItem('devices')) || [];


// devices.forEach(function(device) {
//     const table = document.querySelector('#devices');
//     const row = document.createElement('tr');

//     const user = document.createElement('td');
//     const userText = document.createTextNode(device.user);
//     user.appendChild(userText);

//     const name = document.createElement('td');
//     const nameText = document.createTextNode(device.name);
//     name.appendChild(nameText);

//     row.appendChild(user);
//     row.appendChild(name);

//     table.appendChild(row);
//   });
$.get(`${API_URL}/devices`)
  .then(response => {
    response.forEach(device => {
      $('#devices tbody').append(`
      <tr>
        <td>${device.user}</td>
        <td>${device.name}</td>
      </tr>`
      );
    });
  })
  .catch(error => {
    console.error(`Error: ${error}`);
  });

//   document.querySelector('#add-device').addEventListener('click', function() {
//     const user = document.querySelector('#user').value;
//     const name = document.querySelector('#name').value;
//     devices.push({ user: user, name: name });
//     console.log(devices);
//   });
// $('#add-device').on('click', function() {
//     const user = $('#user').val();
//     const name = $('#name').val();
//     devices.push({ user: user, name: name });
//     console.log(devices);
//   });

$('#add-device').on('click', () => {
  const name = $('#name').val();
  const user = $('#user').val();
  const sensorData = [];

  const body = {
    name,
    user,
    sensorData
  };
  $.post(`${API_URL}/devices`, body)
    .then(response => {
      location.href = '/';
    })
    .catch(error => {
      console.error(`Error: ${error}`);
    });

 

});

$('#send-command').on('click', function () {
  const deviceId = $('#deviceId').val();
  const command = $('#command').val();
  $.post(MQTT_URL, { deviceId, command })
    .then(response => {
      location.href = '/';
    })
});