'use babel';

export default `
  <div class="cacher cacher-create-snippet">
    <h3 clas="block">Create Cacher Snippet</h3>
    <div class="block">
      <select class="input-select select-library"></select>
    </div>
    <div class="block">
      <input type="text" class="input-text native-key-bindings input-title"
        placeholder="Title (required)">
      <div class="text-error">Title is required</div>
    </div>
    <div class="block">
    <input type="text" class="input-text native-key-bindings input-description"
      placeholder="Description (optional)">
    </div>
    <div class="block">
      <input type="text" class="input-text native-key-bindings input-filename"
        placeholder="Filename (required)">
      <div class="text-error">Filename is required</div>
    </div>
    <div class="block">
      <select class="input-select select-private-public">
        <option value="private">Private</option>
        <option value="public">Public</option>
      </select>
    </div>
    <div class="block">
      <select class="input-select select-label"></select>
    </div>
    <div class="block block-spinner">
      <span class="loading loading-spinner-tiny inline-block"></span>
      <span>Saving ...</span>
    </div>
    <div class="block block-general-error text-error"></div>
    <div class="block block-controls">
      <button class="inline-block-tight btn btn-primary action-submit">
        Save Snippet
      </button>
      <button class="inline-block-tight btn action-cancel">
        Cancel
      </button>
    </div>
  </div>
`;
