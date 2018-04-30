'use babel';

import CreateSnippetView from '../views/create-snippet.view';
import SnippetsService from '../services/snippets.service';
import {
  SetupController
} from './setup.controller';

import store from '../store';
import * as util from '../util';

const _ = require('lodash');

export class CreateSnippetController {
  setupController: null;
  snippetsService: null;

  fileContent: string;

  notification: null;
  createSnippetView: null;
  modalPanel: null;

  constructor() {
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

    this.createSnippetView = new CreateSnippetView();
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.createSnippetView.getElement(),
      visible: true
    });

    this.createSnippetView.initialize({

    });
  }

  destroyCreateSnippetView() {
    if (this.createSnippetView) {
      this.createSnippetView.destroy();
      this.createSnippetView = null;
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
    }

    this.destroyCreateSnippetView();
    this.destroyModalPanel();
  }
}
