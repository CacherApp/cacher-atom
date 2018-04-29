'use babel';

import $ from 'jquery';
import ejs from 'ejs';
import Fuse from 'fuse.js';

import store from '../store';
import BaseView from './base.view';

import finderTemplate from '../templates/finder.template';
import finderListTemplate from '../templates/finder-list.template';

const _ = require('lodash');

export default class FinderView extends BaseView {
  events: null;
  $el: null;
  editorModel: null;

  constructor() {
    super();

    this.$el = $(
      ejs.render(finderTemplate, {})
    );
  }

  initialize(events) {
    this.events = events;

    this.editorModel = this.$el.find('atom-text-editor')[0].getModel();
    this.editorModel.setText(
      `function addEmails(emails) {
var i = 0;

var timer = setInterval(function() {
  $('.or-group .condition-dropdown:visible').last().find('.dropdown-toggle').click();
  $('.dropdown-menu:visible').find('li:nth-child(6) a').click();

  var email = emails[i];
  console.log(email);

  $('.or-group input.text-value:visible').last().val(email);
  $('.or-group .or-btn:visible').click();
  i++;

  if (i === emails.length) {
    clearInterval(timer);
  }
}, 250);
}`
    );

    // Allow modal to be larger than default modal size
    this.$el.closest('.modal').toggleClass('modal-cacher-finder', true);

    // Highlight according to filename
    let buffer = this.editorModel.getBuffer();
    let grammar = atom.grammars.grammarForScopeName('source.js');

    buffer.setLanguageMode(
      atom.grammars.languageModeForGrammarAndBuffer(grammar, buffer)
    );

    // Make editor read-only
    this.editorModel.onWillInsertText((event) => {
      event.cancel();
    });

    this.$el.on('click', '.action-cancel', () => {
      this.events.cancel();
    });

    // Escape key also cancels
    this.$el.on('keydown', '.input-search', (event) => {
      if (event.keyCode === 27) {
        this.events.cancel();
      } else {
        // Delay to capture full input value
        setTimeout(() => {
          this.searchSnippets();
        }, 50);
      }
    });

    this.focusOnFirstInput();
    this.searchSnippets();
  }

  searchSnippets() {
    // Sort snippets by created time descending
    let snippets =
      _.sortBy(
        store.snippets, [(snippet) => {
          return (new Date(snippet.createdAt)).getTime();
        }]
      ).reverse();

    let files = [];
    _.each(
      snippets,
      (snippet) => {
        _.each(snippet.files, (file) => {
          let description = file.description || '';

          if (snippet.team) {
            description = `[${snippet.team.name}] ${description}`;
          }

          if (snippet.labels) {
            _.each(snippet.labels, (label: any) => {
              description = `(${label}) ${description}`;
            });
          }

          files.push({
            guid: file.guid,
            title: snippet.title,
            description,
            filename: file.filename,
            content: file.content,
            isPrivate: snippet.isPrivate
          });
        });
      }
    );

    // Use Fuse to search
    let options = {
      threshold: 0.3,
      location: 0,
      distance: 100000,
      tokenize: false,
      matchAllTokens: false,
      maxPatternLength: 30,
      minMatchCharLength: 1,
      shouldSort: true,
      keys: [{
          name: 'title',
          weight: 0.3
        },
        {
          name: 'description',
          weight: 0.1
        },
        {
          name: 'filename',
          weight: 0.2
        },
        {
          name: 'content',
          weight: 0.4
        }
      ]
    };

    let query = this.$el.find('.input-search').val().trim();

    if (query !== '') {
      let fuse = new Fuse(files, options);
      files = fuse.search(query);
    }

    // Only return top 25 results
    files = files.slice(0, 25);

    this.$el.find('.select-list').html(
      ejs.render(finderListTemplate, {
        files
      })
    );
  }

  destroy() {
    if (this.$el) {
      this.$el.remove();
    }
  }

  getElement() {
    return this.$el[0];
  }
}
