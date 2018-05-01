'use babel';

import CreateSnippetView from '../views/create-snippet.view';

import config from '../config';
import store from '../store';

const {
  shell
} = require('electron');

export default class CreateSnippetController {
  setupController: null;
  snippetsService: null;

  fileContent: string;

  notification: null;
  createSnippetView: null;
  modalPanel: null;

  constructor(setupController, snippetsService) {
    this.setupController = setupController;
    this.snippetsService = snippetsService;
  }

  initialize() {
    this.dispose();

    if (!store.loggedIn) {
      this.setupController.initialize();
    }

    if (!this.snippetsService.initialized) {
      return;
    }

    let editor = atom.workspace.getActiveTextEditor();
    if (!editor) {
      return;
    }

    let selection = editor.getSelectedText();
    if (selection.trim() === '') {
      // Use entire file for snippet
      this.fileContent = editor.getText();
    } else {
      this.fileContent = selection;
    }

    if (this.fileContent === '') {
      this.notification =
        atom.notifications.addError(
          'Cannot create snippet without content.'
        );

      return;
    }

    this.createSnippetView = new CreateSnippetView();
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.createSnippetView.getElement(),
      visible: true
    });

    this.createSnippetView.initialize({
      cancel: () => {
        this.destroyCreateSnippetView();
        this.destroyModalPanel();
      },
      submit: (attrs, team) => {
        attrs.content = this.fileContent;

        this.snippetsService.createSnippet(
          attrs,
          (snippet) => {
            this.destroyCreateSnippetView();
            this.destroyModalPanel();

            this.showSuccess(snippet, team);
          },
          (response) => {
            console.error('Cacher: Create snippet failed');
            this.createSnippetView.showError(
              'Failed to create snippet. Please try again.'
            );
          }
        );
      }
    });
  }

  showSuccess(snippet, team) {
    this.notification =
      atom.notifications.addSuccess(
        `"${snippet.title}" created successfully.`,
        {
          buttons: [
            {
              text: 'Open in Cacher',
              onDidClick: () => {
                let url = team
                  ? `${config.appHost}/enter?action=` +
                  `goto_team_snippet&t=${team.guid}&s=${snippet.guid}`
                  : `${config.appHost}/enter?action=` +
                  `goto_snippet&s=${snippet.guid}`;

                shell.openExternal(url);
              }
            },
            {
              text: 'Open snippet page',
              onDidClick: () => {
                shell.openExternal(
                  `${config.snippetsHost}/snippet/${snippet.guid}`
                );
              }
            }
          ]
        }
      );
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
      this.notification = null;
    }

    this.destroyCreateSnippetView();
    this.destroyModalPanel();
  }
}
