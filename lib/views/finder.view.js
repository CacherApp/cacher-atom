'use babel';

import $ from 'jquery';
import ejs from 'ejs';

import BaseView from './base.view';
import finderTemplate from '../templates/finder.template';

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
    this.$el.on('keydown', 'input', (event) => {
      if (event.keyCode === 27) {
        this.events.cancel();
      }
    });

    this.focusOnFirstInput();
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
