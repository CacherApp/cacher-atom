'use babel';

import $ from 'jquery';

export default class CredentialsView {
  constructor() {
    this.$element = $('<div>foobar</div>');
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.$element.remove();
  }

  getElement() {
    return this.$element[0];
  }
}
