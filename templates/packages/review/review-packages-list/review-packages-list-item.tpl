<% if (!model.isDeactivated() || showDeactivatedPackages) { %>

<% if (showNumbering) { %>
<td class="prepend number">
	<%- index %>
</td>
<% } %>

<td class="package first">
	<a href="<%- url %>"><%= textToHtml(model.get('name')) %></a>
</td>

<td class="type">
	<%- model.getPackageTypeName() %>
</td>

<td class="create-date datetime last">
	<% if (model.hasCreateDate()) { %>
	<%= dateToSortableHTML(model.getCreateDate()) %>
	<% } %>
</td>

<% if (showDelete) { %>
<td class="delete append">
	<% if (!model.isDeactivated()) { %>
	<button type="button" class="btn btn-sm" uid="<%- model.get('package_uuid') %>"><i class="fa fa-close"></i></button>
	<% } %>
</td>
<% } %>
<% } %>
