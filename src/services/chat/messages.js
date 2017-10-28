import Twilio from 'twilio';
import removeCircular from '../utils/removeCircular';

export default class TwilioChatMessages {
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
      .messages.list(this.options.paginate)
      .then(sanitize);
  }

  get(id, params) {
    const { channelId } = params;
    return this.client
      .channels(channelId)
      .messages(id)
      .fetch()
      .then(sanitize);
  }

  create(data, params) {
    const { body, attributes, from } = data;
    const { channelId } = params;
    return this.client
      .channels(channelId)
      .messages.create({ body, attributes, from })
      .then(sanitize);
  }

  patch(id, data, params) {
    const { body, attributes } = data;
    const { channelId } = params;
    return this.client
      .channels(channelId)
      .messages(id)
      .update({ body, attributes })
      .then(sanitize);
  }

  remove(id, params) {
    const { channelId } = params;
    return this.client
      .channels(channelId)
      .messages(id)
      .remove()
      .then(sanitize);
  }
}
