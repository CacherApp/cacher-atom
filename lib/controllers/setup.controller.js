'use babel';

import CredentialsView from '../views/credentials.view';
import {
  SnippetsService
} from '../services/snippets.service';

import config from '../config';
import store from '../store';
import * as util from '../util';

const request = require('request');
const {
  shell
} = require('electron');

export class SetupController {
  notification: null;
  credentialsView: null;
  modalPanel: null;

  snippetsService: null;

  constructor(snippetsService: SnippetsService) {
    this.snippetsService = snippetsService;
  }

  initialize() {
    this.dispose();

    if (!util.credentialsExist()) {
      this.promptForSetup();
    } else {
      let credentials = util.getCredentials();

      this.validateCredentials(
        credentials.key,
        credentials.token
      ).then(() => {
        console.log('Cacher: Credentials valid');
      }).catch(() => {});
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
        this.destroyCredentialsView();
        this.destroyModalPanel();
      }
    });
  }

  validateCredentials(apiKey, apiToken) {
    return new Promise((resolve, reject) => {
      request({
        method: 'POST',
        url: `${config.apiHost}/atom/validate`,
        headers: {
          'X-Api-Key': apiKey,
          'X-Api-Token': apiToken
        },
        strictSSL: config.env === 'production'
      }, (error, response, body) => {
        if (response.statusCode === 204) {
          util.saveCredentials(apiKey, apiToken);

          store.loggedIn = true;

          this.destroyCredentialsView();
          this.destroyModalPanel();

          this.snippetsService.initialize();

          resolve();
        } else if (response.statusCode === 403) {
          let jsonResp = JSON.parse(body);

          if (jsonResp.error_code === 'NoPermission') {
            console.error('Cacher: Credentials not valid');

            this.credentialsView.showError(
              'Cacher API key or token not valid. Please try again.'
            );
          } else {
            console.error('Cacher: Upgrade required');

            this.destroyCredentialsView();
            this.destroyModalPanel();

            this.showUpgradeNotification();
          }
          reject();
        } else {
          console.error('Cacher: Unknown error while validating');

          this.credentialsView.showError(
            'There was a problem validating your credentials. Please try again.'
          );
          reject();
        }
      });
    });
  }

  showUpgradeNotification() {
    this.notification =
      atom.notifications.addInfo(
        'Upgrade to the Pro or Team plan to use Atom with Cacher.', {
          dismissable: true,
          buttons: [{
            text: 'View Plans',
            onDidClick: () => {
              shell.openExternal(`${config.appHost}/enter?action=view_plans`);
            }
          }, {
            text: 'Retry Setup',
            onDidClick: () => {
              this.notification.dismiss();
              this.showCredentialsView();
            }
          }]
        }
      );
  }

  destroyCredentialsView() {
    if (this.credentialsView) {
      this.credentialsView.destroy();
      this.credentialsView = null;
    }
  }

  destroyModalPanel() {
    if (this.modalPanel) {
      this.modalPanel.destroy();
      this.modalPanel = null;
    }
  }

  dispose() {
    if (this.notification) {
      this.notification.dismiss();
      this.notification = null;
    }

    this.destroyCredentialsView();
    this.destroyModalPanel();
  }
}
