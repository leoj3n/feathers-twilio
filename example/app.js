const feathers = require('feathers');
const rest = require('feathers-rest');
const socketio = require('feathers-socketio');
const bodyParser = require('body-parser');
const errorHandler = require('feathers-errors/handler');
const smsService = require('../lib').sms;
const chatService = require('../lib').chat;

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
    accountSid: 'your acount sid',
    authToken: 'your auth token' // ex. your.domain.com
  })
);

// Send an email!
app
  .service('twilio/sms')
  .create({
    from: '+15005550006', // Your Twilio SMS capable phone number
    to: '+15551234567',
    body: 'Twilio test'
  })
  .then(function(result) {
    console.log('Sent SMS', result);
  })
  .catch(err => {
    console.log(err);
  });

// chat services
app.use(
  '/twilio/chat/token',
  chatService.token({
    accountSid: 'your acount sid',
    authToken: 'your auth token',
    serviceSid: 'you chat service sid',
    signingKeySid: 'you signing key sid',
    signingKeySecret: 'you signing key secret'
  })
);

app.use(
  '/twilio/chat/users',
  chatService.users({
    accountSid: 'your acount sid',
    authToken: 'your auth token',
    serviceSid: 'you chat service sid'
  })
);

app.use(
  '/twilio/chat/roles',
  chatService.roles({
    accountSid: 'your acount sid',
    authToken: 'your auth token',
    serviceSid: 'you chat service sid'
  })
);

app.use(
  '/twilio/chat/channels',
  chatService.channels({
    accountSid: 'your acount sid',
    authToken: 'your auth token',
    serviceSid: 'you chat service sid'
  })
);

app.use(
  '/twilio/chat/channels/:channelId/members',
  chatService.members({
    accountSid: 'your acount sid',
    authToken: 'your auth token',
    serviceSid: 'you chat service sid'
  })
);

app.use(
  '/twilio/chat/channels/:channelId/messages',
  chatService.messages({
    accountSid: 'your acount sid',
    authToken: 'your auth token',
    serviceSid: 'you chat service sid'
  })
);

app.use(errorHandler());

// Start the server.
const port = 3030;

app.listen(port, function() {
  console.log(`Feathers server listening on port ${port}`);
});
