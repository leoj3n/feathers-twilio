const feathers = require('feathers');
const rest = require('feathers-rest');
const socketio = require('feathers-socketio');
const bodyParser = require('body-parser');
const errorHandler = require('@feathersjs/errors/handler');
const smsService = require('../lib').sms;

// Create a feathers instance.
var app = feathers()
  // Enable REST services
  .configure(rest())
  // Enable Socket.io services
  .configure(socketio())
  // Turn on JSON parser for REST services
  .use(bodyParser.json())
  // Turn on URL-encoded parser for REST services
  .use(bodyParser.urlencoded({ extended: true }));

app.use(
  '/twilio/sms',
  smsService({
    accountSid: 'ACb7f93a8496102a3a80253d2a59e6d4b2',
    authToken: '2b5b7d4b11e5be0b1eb98436410c8f79',
  })
);

app.use(errorHandler());

// Start the server.
const port = 3030;

app.listen(port, function() {
  console.log(`Feathers server listening on port ${port}`);
});
