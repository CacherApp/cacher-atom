'use babel';

import $ from 'jquery';
import ejs from 'ejs';

import store from '../store';

import BaseView from './base.view';
import createSnippetTemplate from '../templates/create-snippet.template';

const path = require('path');
const _ = require('lodash');

export default class CreateSnippetView extends BaseView {
  events: null;
  $el: null;

  library: null;
  filename: '';

  constructor() {
    super();

    this.$el = $(
      ejs.render(createSnippetTemplate, {})
    );

    this.library = store.personalLibrary;
  }

  initialize(events) {
    this.events = events;

    let editor = atom.workspace.getActiveTextEditor();

    this.filename = path.basename(editor.getPath());
    if (this.filename === 'undefined') {
      this.filename = 'untitled';
    }

    this.setFormValues();

    this.$el.on('click', '.action-cancel', () => {
      this.events.cancel();
    });

    let $library = this.$el.find('.select-library');
    $library.change((event) => {
      let val = $library.val();

      if (val === 'personal') {
        this.library = store.personalLibrary;
      } else {
        this.library = _.find(store.teams, {guid: val}).library;
      }

      this.setLabelOptions();
      this.setTabOrder();
    });

    this.$el.find('click', '.action-submit', () => {
      this.$el.find('.text-error').toggle(false);
    });

    // Capture up/down events outside of input box
    $('atom-workspace').on('keydown.cacher', (event) => {
      this.handleKeyEvent(event);
    });

    this.bindEnterSubmit();
    this.focusOnFirstInput();
  }

  handleKeyEvent(event) {
    // Esc
    if (event.keyCode === 27) {
      event.stopPropagation();
      event.preventDefault();
      this.events.cancel();
    }
  }

  setFormValues() {
    this.$el.find('.input-filename').val(this.filename);

    // Show library picker only if there are teams
    this.setLibraryOptions();

    // Show labels picker only if there are labels
    this.setLabelOptions();

    this.setTabOrder();
  }

  setLibraryOptions() {
    let $library = this.$el.find('.select-library');
    $library.toggle(store.teams.length > 0);

    if (store.teams.length > 0) {
      $library.empty();
      $library.append('<option value="personal">Personal Library</option>');

      _.each(store.teams, (team) => {
        $library.append(
          `<option value="${team.guid}">${team.name}</option>`
        );
      });
    }
  }

  setLabelOptions() {
    let $label = this.$el.find('.select-label');
    $label.toggle(this.library.labels.length > 0);

    if (this.library.labels.length > 0) {
      $label.empty();
      $label.append('<option disabled selected>(No labels assigned)</option>');

      _.each(this.library.labels, (label) => {
        $label.append(`<option value="${label.guid}">${label.title}</option>`);
      });
    }
  }

  setTabOrder() {
    let tabIndex = 1;
    this.$el.find('input, select, button').each(function() {
      $(this).attr('tabindex', tabIndex);
      tabIndex++;
    });
  }

  showError() {

  }

  serialize() {}

  destroy() {
    if (this.$el) {
      this.$el.remove();
    }
  }

  getElement() {
    return this.$el[0];
  }
}
