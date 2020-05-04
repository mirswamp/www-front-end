<% if (!isDeactivated || showDeactivatedProjects) { %>

<td class="project">
	<a href="<%= url %>"><%- full_name %></a>
</td>

<td class="description">
	<%- description %>
</td>

<td class="create-date datetime">
	<%= dateToSortableHTML(create_date) %>
</td>

<% if (showDelete) { %>
<td class="delete">
	<button type="button" class="btn btn-sm"><i class="fa fa-times"></i></button>
</td>
<% } %>
<% } %>