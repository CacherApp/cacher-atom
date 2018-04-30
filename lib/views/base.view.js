'use babel';

import $ from 'jquery';

/**
 * Extend BaseView to use common utility methods.
 */
export default class BaseView {
  /**
   * Submit form on 'Enter' keypress.
   */
  bindEnterSubmit() {
    this.$el.on(
      'keydown',
      'input[type="text"], input[type="password"]',
      (event) => {
        if (event.key === 'Enter') {
          this.$el.find('.action-submit').trigger('click');
        }
      }
    );
  }

  /**
   * Let user type in form right away.
   */
  focusOnFirstInput() {
    this.$el.find('input[type="text"], input[type="password"]').first().focus();
  }

  handleWorkspaceKeyEvents() {
    $('atom-workspace').on('keydown.cacher', (event) => {
      this.handleCommonKeyEvents(event);
    });
  }

  /**
   * Handle common key events for modal views.
   * @param {object} event Keydown event.
   */
  handleCommonKeyEvents(event) {
    // Esc
    if (event.keyCode === 27) {
      event.stopPropagation();
      event.preventDefault();
      this.events.cancel();
    }
  }

  /**
   * Common destroy for views.
   */
  destroy() {
    if (this.$el) {
      this.$el.remove();
    }

    $('atom-workspace').off('keydown.cacher');
  }
};
