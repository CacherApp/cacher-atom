'use babel';

import CredentialsView from '../views/credentials.view';
import * as util from '../util';

export class SetupController {
  credentialsView: null;
  modalPane: null;

  initialize() {
    if (!util.credentialsExist()) {
      this.promptForSetup();
    } else {

    }
  }

  promptForSetup() {
    console.log('prompt for setup');

    atom.notifications.addInfo(
      'Set up your Cacher credentials to use snippets.',
      {
        dismissable: true,
        buttons: [
          {
            text: 'Setup Cacher',
            onDidClick: () => this.showCredentialsView()
          }
        ]
      }
    );
  }

  showCredentialsView() {
    this.credentialsView = new CredentialsView();

    this.modalPanel = atom.workspace.addModalPanel({
      item: this.credentialsView.getElement(),
      visible: true
    });
  }
};
