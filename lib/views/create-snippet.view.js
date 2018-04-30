'use babel';

import $ from 'jquery';
import ejs from 'ejs';

import BaseView from './base.view';
import createSnippetTemplate from '../templates/create-snippet.template';

export default class CreateSnippetView extends BaseView {
  events: null;
  $el: null;

  constructor() {
    super();

    this.$el = $(
      ejs.render(createSnippetTemplate, {})
    );
  }

  initialize(events) {
    this.events = events;
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
