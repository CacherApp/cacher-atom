'use babel';

import {
  CompositeDisposable
} from 'atom';

import {
  SetupController
} from './controllers/setup.controller';

export default {
  activate(state) {
    let setupController = new SetupController();
    setupController.initialize();
  },

  deactivate() {

  },

  serialize() {

  }
};
