'use babel';

export default `
  <div class="cacher cacher-finder">
    <div class="block">
      <input class="input-text input-search native-key-bindings"
        type="text"
        placeholder="Find snippet"
        tabindex="1">
    </div>
    <div class="finder-container">
      <div class="select-list"></div>
      <div class="code-preview">
        <atom-text-editor></atom-text-editor>
        <div class="controls">
          <div class="btn-toolbar">
            <button class="btn btn-primary icon icon-arrow-down action-insert">Insert</button>
            <div class="btn-group">
              <button class="btn icon icon-link-external action-app">App</button>
              <button class="btn icon icon-link-external action-page">Page</button>
            </div>
          </div>
          <div>
            <button class="btn inline-block-tight action-cancel">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
`;
