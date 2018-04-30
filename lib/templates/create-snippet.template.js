'use babel';

export default `
  <div class="cacher cacher-create-snippet">
    <div class="block">
      <select class="input-select select-library"></select>
    </div>
    <div class="block">
      <input type="text" class="input-text native-key-bindings input-title"
        placeholder="Title (required)">
    </div>
    <div class="block">
    <input type="text" class="input-text native-key-bindings input-description"
      placeholder="Description (optional)">
    </div>
    <div class="block">
      <input type="text" class="input-text native-key-bindings input-filename"
        placeholder="Filename (required)">
    </div>
    <div class="block">
      <select class="input-select">
        <option value="private">Private</option>
        <option value="public">Public</option>
      </select>
    </div>
    <div class="block">
      <select class="input-select select-label">

      </select>
    </div>
    <div class="block block-controls">
      <button class="inline-block-tight btn btn-primary action-save">
        Save Snippet
      </button>
      <button class="inline-block-tight btn action-cancel">
        Cancel
      </button>
    </div>
  </div>
`;
