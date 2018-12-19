I'll submit one. It's not clear to me yet what happens with the callback/streaming of the new Twilio API:

```js
// List messages using callbacks
twilio.messages.list(function(err, messages) {
  console.log('Listing messages using callbacks');
  _.each(messages, function(message) {
    console.log(message.sid);
  });
});

// List messages using promises
promise = twilio.messages.list();
promise.then(function(messages) {
  console.log('Listing messages using promises');
  _.each(messages, function(message) {
    console.log(message.sid);
  });
});
```

When implementing `find()` in the sms `Service` class:

```js
class Service {
  find (params) {
    opts = {
      limit: 2000,
      pageSize: 50,
    };

    return this.client.list(opts); // return promise
  }
```

Assuming there are a couple thousand SMS in your Twilio account, will this cause the feathers service to only return the first 50? Or will feathers wait for all 2000 messages? I'm worried feathers won't know if/when Twilio is done fetching, and that there might need to be some extra code around this to not resolve on the first callback but instead once the "stream" has completed and all results are in.

Before sending a PR I'm trying to understand how the new Twilio API supposedly "streams" pages of results.

You see here in `this.each` the Twilio API calls `this._version.readLimits`:

https://github.com/twilio/twilio-node/blob/61d5e82d1cf40db07577efddb550a48c3e3bf2d9/lib/rest/messaging/v1/service.js#L180

Which I believe is this:

https://github.com/twilio/twilio-node/blob/61d5e82d1cf40db07577efddb550a48c3e3bf2d9/lib/base/Version.js#L149-L182

Supposedly the default `pageSize` is 50:

> when not set will use the default value of 50 records

I've got a Twilio account with 59 messages and all 59 come through the feathers service via rest when using the new Twilio API. In the `find` function of this feathers service, I return the Twilio API promise. I kind of expected only the first 50 messages to come through based on my understanding of how the new Twilio API "streams" and how the `find` function of a feathers service resolves a promise. Either the new Twilio API is streaming all 59 messages on the first resolve

official advice to count: https://stackoverflow.com/questions/35974501/twilio-api-count-messages-number-has-received
