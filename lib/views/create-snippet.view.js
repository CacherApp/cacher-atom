'use babel';

import $ from 'jquery';
import ejs from 'ejs';

import store from '../store';

import BaseView from './base.view';
import createSnippetTemplate from '../templates/create-snippet.template';

import {
  getModeForPath
} from '../filetypes';

const path = require('path');
const _ = require('lodash');

export default class CreateSnippetView extends BaseView {
  events: null;
  $el: null;

  team: null;
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
        this.team = null;
        this.library = store.personalLibrary;
      } else {
        let team = _.find(store.teams, {guid: val});
        this.team = team;
        this.library = team.library;
      }

      this.setLabelOptions();
      this.setTabOrder();
    });

    this.$el.on('click', '.action-submit', () => {
      this.submitForm();
    });

    // Capture up/down events outside of input box
    $('atom-workspace').on('keydown.cacher', (event) => {
      this.handleCommonKeyEvents(event);
    });

    this.bindEnterSubmit();
    this.focusOnFirstInput();
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

  submitForm() {
    this.$el.find('.text-error').toggle(false);

    let $title = this.$el.find('.input-title');
    let $filename = this.$el.find('.input-filename');

    let title = $title.val().trim();
    let filename = $filename.val().trim();

    if (!title) {
      $title.closest('.block').find('.text-error').toggle(true);
    }

    if (!filename) {
      $filename.closest('.block').find('.text-error').toggle(true);
    }

    let isPrivate = this.$el.find('.select-private-public').val() === 'private';
    let libraryGuid = this.library.guid;

    let description = this.$el.find('.input-description').val().trim();

    let labelGuids = [];
    let $label = this.$el.find('.select-label');

    // Only use label value if shown
    if ($label.is(':visible')) {
      let labelGuid = $label.val();
      if (labelGuid) {
        labelGuids = [labelGuid];
      }
    }

    let filetype = getModeForPath(filename).mode.split('/')[2];

    if (title && filename) {
      this.$el.find('.block-controls').toggle(false);
      this.$el.find('.block-spinner').toggle(true);

      this.events.submit({
        title,
        filename,
        description,
        filetype,
        isPrivate,
        labelGuids,
        libraryGuid
      }, this.team);
    }
  }

  showError(html) {
    this.$el.find('.block-spinner').toggle(false);
    this.$el.find('.block-controls').toggle(true);

    this.$el.find('.block-general-error')
      .html(html)
      .toggle(true);
  }

  destroy() {
    if (this.$el) {
      this.$el.remove();
    }

    $('atom-workspace').off('keydown.cacher');
  }

  getElement() {
    return this.$el[0];
  }
}
