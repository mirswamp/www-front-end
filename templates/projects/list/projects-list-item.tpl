<% if (!model.isDeactivated() || showDeactivatedProjects) { %>

<% if (showNumbering) { %>
<td class="prepend number">
	<%- index %>
</td>
<% } %>

<td class="project first">
	<a href="#projects/<%- project_uid %>"><%- full_name %></a>
</td>

<td class="description">
	<%- description %>
</td>

<td class="create-date datetime last">
	<% if (model.hasCreateDate()) { %>
	<%= dateToSortableHTML(model.getCreateDate()) %>
	<% } %>
</td>

<% if (showDelete) { %>
<td class="append">
	<button type="button" class="delete btn btn-sm"><i class="fa fa-times"></i></button>
</td>
<% } %>
<% } %>
