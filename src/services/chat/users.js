import Twilio from 'twilio';
import removeCircular from '../utils/removeCircular';

export default class TwilioChatUsers {
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
    return this.client.users.list(this.options.paginate).then(removeCircular);
  }

  get(id) {
    return this.client
      .users(id)
      .fetch()
      .then(removeCircular);
  }

  create(data) {
    const { identity, friendlyName, attributes, roleSid } = data;
    return this.client.users
      .create({
        identity,
        friendlyName,
        attributes,
        roleSid
      })
      .then(removeCircular);
  }

  patch(id, data) {
    const { uniqueName, friendlyName, attributes } = data;
    return this.client
      .users(id)
      .update({ uniqueName, friendlyName, attributes })
      .then(removeCircular);
  }

  remove(id) {
    return this.client
      .users(id)
      .remove()
      .then(removeCircular);
  }
}
