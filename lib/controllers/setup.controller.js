'use babel';

import CredentialsView from '../views/credentials.view';
import config from '../config';
import * as util from '../util';

const request = require('request');

export class SetupController {
  notification: null;
  credentialsView: null;
  modalPane: null;

  initialize() {
    if (!util.credentialsExist()) {
      this.promptForSetup();
    } else {
      // todo: load snippets
    }
  }

  promptForSetup() {
    this.notification =
      atom.notifications.addInfo(
        'Set up your Cacher credentials to use snippets.', {
          dismissable: true,
          buttons: [{
            text: 'Setup Cacher',
            onDidClick: () => {
              this.notification.dismiss();
              this.showCredentialsView();
            }
          }]
        }
      );
  }

  showCredentialsView() {
    this.credentialsView = new CredentialsView();

    this.modalPanel = atom.workspace.addModalPanel({
      item: this.credentialsView.getElement(),
      visible: true,
      autoFocus: true
    });

    this.credentialsView.initialize({
      submit: (apiKey, apiToken) => {
        this.validateCredentials(apiKey, apiToken);
      },
      cancel: () => {
        this.modalPanel.destroy();
      }
    });
  }

  validateCredentials(apiKey, apiToken) {
    request({
      method: 'POST',
      url: `${config.apiHost}/atom/validate`,
      headers: {
        'X-Api-Key': apiKey,
        'X-Api-Token': apiToken
      },
      strictSSL: config.env === 'production'
    }, (error: any, response: any, body: any) => {
      if (response.statusCode === 204) {
        // todo: succeess
      } else if (response.statusCode === 403) {

        let jsonResp = JSON.parse(body);
        if (jsonResp.error_code === 'NoPermission') {
          console.error('Cacher: Credentials not valid');
          this.credentialsView.showAuthError();
        } else {
          console.error('Cacher: Upgrade required');
        }
      } else {
        // todo: other error
      }
    });
  }
};
