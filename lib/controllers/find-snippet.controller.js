'use babel';

import FinderView from '../views/finder.view';
import SnippetsService from '../services/snippets.service';
import {
  SetupController
} from './setup.controller';

import config from '../config';
import store from '../store';
import * as util from '../util';

const {
  shell
} = require('electron');

export class FindSnippetController {
  setupController: null;
  snippetsService: null;

  notification: null;
  finderView: null;
  modalPanel: null;

  constructor(setupController: SetupController,
              snippetsService: SnippetsService) {
    this.setupController = setupController;
    this.snippetsService = snippetsService;
  }

  initialize() {
    if (!store.loggedIn) {
      this.setupController.initialize();
    }

    if (!this.snippetsService.initialized) {
      return;
    }

    this.finderView = new FinderView();
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.finderView.getElement(),
      visible: true
    });

    this.finderView.initialize({
      insert: () => {},
      openInApp: () => {},
      openPage: () => {},
      cancel: () => {
        this.destroyModalPanel();
      }
    });
  }

  destroyModalPanel() {
    if (this.modalPanel) {
      this.modalPanel.destroy();
    }
  }

  dispose() {
    if (this.notification) {
      this.notification.dismiss();
    }

    this.destroyModalPanel();
  }
}
