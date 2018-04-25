'use babel';

export default class BaseView {
  /**
  * Submit form on 'Enter' keypress.
  */
  bindEnterSubmit() {
    this.$el.on('keydown', 'input[type="text"], input[type="password"]', (event) => {
      if (event.key === "Enter") {
        this.$el.find('.action-submit').trigger('click');
      }
    });
  }

  focusOnFirstInput() {
    this.$el.find('input[type="text"], input[type="password"]').first().focus();
  }
};
