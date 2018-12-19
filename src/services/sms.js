import Twilio from 'twilio';
import errors from '@feathersjs/errors';
import { filterQuery } from '@feathersjs/commons';

class Service {
  constructor (options = {}) {
    if (!options.accountSid) {
      throw new Error('Twilio `accountSid` needs to be provided');
    }

    if (!options.authToken) {
      throw new Error('Twilio `authToken` needs to be provided');
    }

    this.from = options.from || null;
    this.paginate = options.paginate || {};
    
    this.client = new Twilio(options.accountSid, options.authToken);
  }

  find (params) {
    const paginate = (params && typeof params.paginate !== 'undefined') ? params.paginate : this.paginate;
    const result = this._find(params, !!paginate.default,
      query => filterQuery(query, paginate)
    );

    return result;
  }

  _find (params, count, getFilter = filterQuery) {
    const { filters, query } = getFilter(params.query || {});

    let opts = {};

    // Handle $limit
    if (filters.$limit === 0) {
      opts = {
        category: 'sms',
      };

      return new Promise((resolve, reject) => {
        this.client.usage.records.list(opts).then((records) => {
          // note this api call probably won't ever return more than one record
          const total = records.reduce((a, r) => +a + +r.count, 0);
          resolve({
            total,
            limit: filters.$limit,
            data: [],
          });
        }).catch(reject);
      });
    }
    
    if (typeof filters.$limit !== 'undefined') {
      opts = {
        limit: filters.$limit,
      }; 
    }

    return new Promise((resolve, reject) => {
      // allow non-standard filters
      opts = Object.assign({}, opts, query);
      this.client.messages.list(opts).then((messages) => {
        const total = messages.length;
        resolve({
          total,
          limit: filters.$limit,
          data: messages,
        });
      }).catch(reject);
    });
  }

  get (id) {
    return new Promise((resolve, reject) => {
      if (!id) {
        return reject(new errors.BadRequest('`id` needs to be provided'));
      }

      return this.client.messages(id).get().then(resolve).catch(reject);
    });
  }

  create (data) {
    return new Promise((resolve, reject) => {
      data.from = data.from || this.from;

      if (!data.from) {
        return reject(new errors.BadRequest('`from` must be specified'));
      }

      if (!data.to) {
        return reject(new errors.BadRequest('`to` must be specified'));
      }

      if (!data.body && !data.mediaUrl) {
        return reject(new errors.BadRequest('`body` or `mediaUrl` must be specified'));
      }

      return this.client.messages.create(data).then(resolve).catch(reject);
    });
  }
}

export default function init (options) {
  return new Service(options);
}

init.Service = Service;
