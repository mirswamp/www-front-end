<% if (!isDeactivated || showDeactivatedTools) { %>

<td class="tool">
	<a href="<%= url %>" target="_blank"><%= name %></a>
</td>

<td class="package-types">
	<%= package_type_names.toCSV() %>
</td>

<td class="sharing">
	<%= tool_sharing_status %>
</td>

<td class="date datetime">
	<% if (typeof create_date !== 'undefined') { %>
	<%= dateToSortableHTML(create_date) %>
	<% } %>
</td>

<% if (showDelete) { %>
<td class="delete">
	<% if (!isDeactivated) { %>
	<button type="button" class="btn btn-sm" uid="<%- tool_uuid %>"><i class="fa fa-close"></i></button>
	<% } %>
</td>
<% } %>
<% } %>