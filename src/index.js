if (!global._babelPolyfill) {
  require('babel-polyfill');
}

import call from './services/call';
import sms from './services/sms';
import * as chat from './services/chat';

export default { call, sms, chat };
