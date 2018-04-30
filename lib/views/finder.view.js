/* eslint no-invalid-this: 0 */

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
  editor: null;

  files: [];

  constructor() {
    super();

    this.$el = $(
      ejs.render(finderTemplate, {})
    );
  }

  initialize(events) {
    this.events = events;

    // Allow modal to be larger than default modal size
    this.$el.closest('.modal').toggleClass('modal-cacher-finder', true);

    this.editor = this.$el.find('atom-text-editor')[0].getModel();

    // Make editor read-only
    this.editor.onWillInsertText((event) => {
      event.cancel();
    });

    // Soft-wrap text
    this.editor.setSoftWrapped(true);

    let _this = this;
    this.$el.on('click', '.select-list li', function() {
      // OK, this refers to the element being clicked on
      _this.selectFile($(this));
    });

    this.$el.on('click', '.action-insert', () => {
      this.insertFile();
    });

    this.$el.on('click', '.action-copy', () => {
      this.copyFile();
    });

    this.$el.on('click', '.action-app', () => {
      this.openInApp();
    });

    this.$el.on('click', '.action-page', () => {
      this.openPage();
    });

    this.$el.on('click', '.action-cancel', () => {
      this.events.cancel();
    });

    // Escape key also cancels
    this.$el.on('keydown', '.input-search', (event) => {
      this.handleKeyEvent(
        event,
        () => {
          setTimeout(() => {
            this.searchFiles();
          }, 5);
        }
      );
    });

    // Capture up/down events outside of input box
    $('atom-workspace').on('keydown.cacher', (event) => {
      this.handleKeyEvent(event);
    });

    this.focusOnFirstInput();
    this.searchFiles();
  }

  handleKeyEvent(event, defaultCallback) {
    switch (event.keyCode) {
      // Enter
      case 13:
        {
          this.insertFile();
          break;
        }
        // Esc
      case 27:
        {
          event.stopPropagation();
          event.preventDefault();
          this.events.cancel();
          break;
        }
        // Up
      case 38:
        {
          event.stopPropagation();
          event.preventDefault();
          this.previousFile();
          break;
        }
        // Down
      case 40:
        {
          event.stopPropagation();
          this.nextFile();
          break;
        }
      default:
        {
          if (defaultCallback) {
            defaultCallback();
          }
        }
    }
  }

  selectFile($item) {
    let file = _.find(
      this.files, {
        guid: $item.attr('data-guid')
      }
    );

    // Highlight according to filename
    let buffer = this.editor.getBuffer();
    let grammar = _.find(
      atom.grammars.getGrammars(),
      (grammar) => {
        // Match filetype with end of filename
        let matchingFiletype =
          _.find(
            grammar.fileTypes,
            (fileType) => file.filename.endsWith(fileType)
          );

        return matchingFiletype != null;
      }
    );

    if (grammar) {
      buffer.setLanguageMode(
        atom.grammars.languageModeForGrammarAndBuffer(grammar, buffer)
      );
    }

    this.editor.setText(file.content);

    this.$el.find('.select-list li').toggleClass('selected', false);
    $item.toggleClass('selected', true);
  }

  nextFile() {
    let $nextFile = this.$el.find('.select-list li.selected').next('li');

    if ($nextFile.length) {
      $nextFile.click();

      // Only use scrolling behavior if selected item is at bottom
      if ($nextFile.position().top + $nextFile.outerHeight() >
        this.$el.find('.list-group').innerHeight()) {
        $nextFile[0].scrollIntoView(false);
      }
    }
  }

  previousFile() {
    let $previousFile = this.$el.find('.select-list li.selected').prev('li');

    if ($previousFile.length) {
      $previousFile.click();

      // Only use scrolling behavior if selected item is at top
      if ($previousFile.position().top < 0) {
        $previousFile[0].scrollIntoView(true);
      }
    }
  }

  searchFiles() {
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

          description = `${description} ${file.filename}`;

          files.push({
            guid: file.guid,
            title: snippet.title,
            description,
            filename: file.filename,
            content: file.content,
            isPrivate: snippet.isPrivate,
            snippet
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
    this.files = files.slice(0, 25);

    this.$el.find('.select-list').html(
      ejs.render(finderListTemplate, {
        files: this.files
      })
    );

    // Hide list, code and controls if no matches
    this.$el.find('.finder-container').toggle(this.files.length > 0);
    this.$el.find('.blank-slate').toggle(this.files.length === 0);

    // Select first result
    this.$el.find('.select-list li').first().click();
  }

  insertFile() {
    let file = this.getSelectedFile();
    if (file) {
      this.events.insert(file);
    }
    this.events.cancel();
  }

  copyFile() {
    let file = this.getSelectedFile();
    if (file) {
      this.events.copy(file);
    }
    this.events.cancel();
  }

  openInApp() {
    let file = this.getSelectedFile();
    if (file) {
      this.events.openInApp(file);
    }
    this.events.cancel();
  }

  openPage() {
    let file = this.getSelectedFile();
    if (file) {
      this.events.openPage(file);
    }
    this.events.cancel();
  }

  destroy() {
    if (this.$el) {
      this.$el.remove();
    }

    $('atom-workspace').off('keydown.cacher');
  }

  getSelectedFile() {
    return _.find(
      this.files, {
        guid: this.$el.find('.select-list li.selected').attr('data-guid')
      }
    );
  }

  getElement() {
    return this.$el[0];
  }
}
