import Twilio from 'twilio';

const AccessToken = Twilio.jwt.AccessToken;
const ChatGrant = AccessToken.ChatGrant;

export default class TwilioChatToken {
  constructor(options = {}) {
    if (!options.accountSid) {
      throw new Error('Twilio `accountSid` needs to be provided');
    }

    if (!options.authToken) {
      throw new Error('Twilio `authToken` needs to be provided');
    }

    if (!options.serviceSid) {
      throw new Error('Twilio `serviceSid` needs to be provided');
    }

    if (!options.signingKeySid) {
      throw new Error('Twilio `signingKeySid` needs to be provided');
    }

    if (!options.signingKeySecret) {
      throw new Error('Twilio `signingKeySid` needs to be provided');
    }

    if (!options.appName) {
      throw new Error('An `appName` needs to be provided');
    }

    this.options = options;
  }

  create(data) {
    const { identity, device } = data;
    const appName = this.options.appName;
    const endpointId = `${appName}:${identity}:${device}`;

    const token = new AccessToken(
      this.options.accountSid,
      this.options.signingKeySid,
      this.options.signingKeySecret,
      { ttl: this.options.ttl || 3600 * 24 }
    );

    const chatGrant = new ChatGrant({
      serviceSid: this.options.serviceSid,
      endpointId
    });

    token.addGrant(chatGrant);
    token.identity = identity;

    return Promise.resolve({
      identity,
      device,
      token: token.toJwt()
    });
  }
}
