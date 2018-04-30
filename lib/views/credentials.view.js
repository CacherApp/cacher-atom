'use babel';

import $ from 'jquery';
import ejs from 'ejs';

import BaseView from './base.view';
import config from '../config';
import credentialsTemplate from '../templates/credentials.template';

export default class CredentialsView extends BaseView {
  events: null;
  $el: null;

  constructor() {
    super();

    let data = {
      viewApiUrl: `${config.appHost}/enter?action=view_api_creds`
    };

    this.$el = $(
      ejs.render(credentialsTemplate, data)
    );
  }

  initialize(events) {
    this.events = events;

    this.$el.on('click', '.action-submit', () => {
      this.$el.find('.text-error').toggle(false);

      // Validate input
      let apiKey = this.$el.find('.input-api-key').val().trim();
      let apiToken = this.$el.find('.input-api-token').val().trim();

      if (!apiKey) {
        this.$el.find('.block-key .text-error').toggle(true);
      }

      if (!apiToken) {
        this.$el.find('.block-token .text-error').toggle(true);
      }

      if (apiKey && apiToken) {
        this.$el.find('.block-controls').toggle(false);
        this.$el.find('.block-spinner').toggle(true);
        this.events.submit(apiKey, apiToken);
      }
    });

    this.$el.on('click', '.action-cancel', () => {
      this.events.cancel();
    });

    // Capture up/down events outside of input box
    $('atom-workspace').on('keydown.cacher', (event) => {
      this.handleCommonKeyEvents(event);
    });

    this.bindEnterSubmit();
    this.focusOnFirstInput();
  }

  showError(html) {
    this.$el.find('.block-spinner').toggle(false);
    this.$el.find('.block-controls').toggle(true);

    this.$el.find('.block-general-error')
      .html(html)
      .toggle(true);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
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
