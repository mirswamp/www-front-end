<% if (!model.isDeactivated() || showDeactivatedTools) { %>

<% if (showNumbering) { %>
<td class="prepend number">
	<%- index %>
</td>
<% } %>

<td class="tool first">
	<a href="<%- url %>"><%- model.get('name') %></a>
</td>

<td class="package-types">
	<%- model.get('package_type_names').toCSV() %>
</td>

<td class="sharing">
	<%- model.get('tool_sharing_status') %>
</td>

<td class="create-date datetime last">
	<% if (model.hasCreateDate()) { %>
	<%= dateToSortableHTML(model.getCreateDate()) %>
	<% } %>
</td>

<% if (showDelete) { %>
<td class="append">
	<% if (!model.isDeactivated()) { %>
	<button type="button" class="delete btn btn-sm" uid="<%- model.get('tool_uuid') %>"><i class="fa fa-close"></i></button>
	<% } %>
</td>
<% } %>
<% } %>
