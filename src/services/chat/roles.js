import Twilio from 'twilio';
import removeCircular from '../utils/removeCircular';

export default class TwilioChatRoles {
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
    return this.client.roles.list(this.options.paginate).then(removeCircular);
  }

  get(id) {
    return this.client
      .roles(id)
      .fetch()
      .then(removeCircular);
  }

  create(data) {
    const { friendlyName, type, permission } = data;
    return this.client.roles
      .create({ friendlyName, type, permission })
      .then(removeCircular);
  }

  patch(id, data) {
    const { permission } = data;
    return this.client
      .roles(id)
      .update({ permission })
      .then(removeCircular);
  }

  remove(id) {
    return this.client
      .roles(id)
      .remove()
      .then(removeCircular);
  }
}
