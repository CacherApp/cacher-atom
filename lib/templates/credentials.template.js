'use babel';

export default `
<div class="cacher">
  <h3 class="block">Enter Cacher Credentials</h3>
  <div class="block">
    <a href="<%= viewApiUrl %>">Open Cacher</a> to view your user credentials.
  </div>
  <div class="block block-key">
    <input class="input-text native-key-bindings input-api-key"
    type="password"
    placeholder="API Key">
    <div class="text-error">API key is required</div>
  </div>
  <div class="block block-token">
    <input class="input-text native-key-bindings input-api-token"
    type="password"
    placeholder="API Token">
    <div class="text-error">API token is required</div>
  </div>
  <div class="block block-spinner">
    <span class="loading loading-spinner-tiny inline-block"></span>
    <span>Validating ...</span>
  </div>
  <div class="block block-general-error text-error"></div>
  <div class="block block-controls">
    <button class="inline-block-tight btn btn-primary action-submit">
      Submit
    </button>
    <button class="inline-block-tight btn action-cancel">Cancel</button>
  </div>
</div>
`;
