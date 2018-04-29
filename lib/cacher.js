'use babel';

import {
  CompositeDisposable
} from 'atom';

import {
  SetupController
} from './controllers/setup.controller';

import {
  FindSnippetController
} from './controllers/find-snippet.controller';

import {
  SnippetsService
} from './services/snippets.service';

export default {
  subscriptions: null,
  snippetsService: null,
  setupController: null,
  findSnippetController: null,

  activate(state) {
    this.snippetsService = new SnippetsService();
    this.setupController = new SetupController(this.snippetsService);
    this.setupController.initialize();

    this.findSnippetController = new FindSnippetController(
      this.setupController,
      this.snippetsService
    );

    this.addSubscriptions();
  },

  addSubscriptions() {
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(
      atom.commands.add(
        'atom-workspace', {
          'cacher:findSnippet': {
            didDispatch: () => { this.findSnippetController.initialize(); },
            displayName: 'Cacher: Find Snippet',
            description: 'Find a snippet to insert or open'
          }
        }
      )
    );

    this.subscriptions.add(
      atom.commands.add('atom-workspace', {
        'cacher:createSnippet': {
          didDispatch: () => { console.log('create snippet'); },
          displayName: 'Cacher: Create Snippet',
          description: 'Create a Cacher snippet from file or selection'
        }
      })
    );

    this.subscriptions.add(
      atom.commands.add('atom-workspace', {
        'cacher:setup': {
          didDispatch: () => { this.setupController.showCredentialsView(); },
          displayName: 'Cacher: Setup',
          description: 'Setup a new Cacher user'
        }
      })
    );

    this.subscriptions.add(
      atom.commands.add('atom-workspace', {
        'cacher:refresh': {
          didDispatch: () => { this.snippetsService.fetchSnippets(); },
          displayName: 'Cacher: Refresh',
          description: 'Refresh Cacher snippets and labels'
        }
      })
    );
  },

  deactivate() {
    this.subscriptions.dispose();
    this.snippetsService.dispose();
    this.setupController.dispose();
    this.findSnippetController.dispose();
  },

  serialize() {

  }
};
