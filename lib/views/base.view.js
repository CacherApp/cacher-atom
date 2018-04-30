'use babel';

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
};
