import Twilio from 'twilio';
import removeCircular from '../utils/removeCircular';

export default class TwilioChatMembers {
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

    this.options = options;

    const twilio = new Twilio(options.accountSid, options.authToken);
    this.client = twilio.chat.services(options.serviceSid);
  }

  find(params) {
    const { channelId } = params;
    return this.client
      .channels(channelId)
      .members.list(this.options.paginate)
      .then(removeCircular);
  }

  get(id, params) {
    const { channelId } = params;
    return this.client
      .channels(channelId)
      .members(id)
      .fetch()
      .then(removeCircular);
  }

  create(data, params) {
    const { identity, roleSid } = data;
    const { channelId } = params;
    return this.client
      .channels(channelId)
      .members.create({ identity, roleSid })
      .then(removeCircular);
  }

  remove(id, params) {
    const { channelId } = params;
    return this.client
      .channels(channelId)
      .members(id)
      .remove()
      .then(removeCircular);
  }
}
