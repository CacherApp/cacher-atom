'use babel';

export default `
  <ol class="list-group">
    <% files.forEach(function(file) { %>
      <li class="two-lines" data-guid="<%= file.guid %>">
        <% if (file.isPrivate) { %>
          <div class="status icon icon-lock"></div>
        <% } %>
        <div class="primary-line"><%= file.title %></div>
        <div class="secondary-line"><%= file.description %></div>
      </li>
    <% }); %>
  </ol>
`;
