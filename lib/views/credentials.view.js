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

    this.handleWorkspaceKeyEvents();
    this.bindEnterSubmit();
    this.focusOnFirstInput();
    this.setTabOrder();
  }

  showError(html) {
    this.$el.find('.block-spinner').toggle(false);
    this.$el.find('.block-controls').toggle(true);

    this.$el.find('.block-general-error')
      .html(html)
      .toggle(true);
  }

  getElement() {
    return this.$el[0];
  }
}
