'use babel';

import CreateSnippetView from '../views/create-snippet.view';

import store from '../store';

export class CreateSnippetController {
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
      }
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
