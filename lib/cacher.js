'use babel';

import {
  CompositeDisposable
} from 'atom';

import {
  SetupController
} from './controllers/setup.controller';

import {
  SnippetsService
} from './services/snippets.service';

export default {
  activate(state) {
    let snippetsService = new SnippetsService();
    let setupController = new SetupController(snippetsService);
    setupController.initialize();
  },

  deactivate() {

  },

  serialize() {

  }
};
