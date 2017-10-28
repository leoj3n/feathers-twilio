import Twilio from 'twilio';
import removeCircular from '../utils/removeCircular';

export default class TwilioChatChannels {
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

  find() {
    return this.client.channels
      .list(this.options.paginate)
      .then(removeCircular);
  }

  get(id) {
    return this.client
      .channels(id)
      .fetch()
      .then(removeCircular);
  }

  create(data) {
    const { uniqueName, friendlyName, attributes, type = 'private' } = data;
    return this.client.channels
      .create({
        uniqueName,
        friendlyName,
        attributes,
        type
      })
      .then(removeCircular);
  }

  patch(id, data) {
    const { uniqueName, friendlyName, attributes } = data;
    return this.client
      .channels(id)
      .update({ uniqueName, friendlyName, attributes })
      .then(removeCircular);
  }

  remove(id) {
    return this.client
      .channels(id)
      .remove()
      .then(removeCircular);
  }
}
