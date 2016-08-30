/* eslint-disable import/no-unresolved */
import dbAppFactory from 'collab-db-application';
import dbLogFactory from 'collab-db-logging';
import config from 'config';
/* eslint-enable import/no-unresolved */

let storageInstance = null;

export default class storageHelper {
  constructor() {
    if (!storageInstance) {
      storageInstance = {
        app: dbAppFactory(config.get('app_database')),
        log: dbLogFactory(config.get('logging_database'))
      };
    }
    return storageInstance;
  }
}
