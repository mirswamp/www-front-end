<% if (showNumbering) { %>
<td class="prepend number">
	<%- index %>
</td>
<% } %>

<td class="version-string first">
	<% if (url) { %>
	<a href="<%- url %>"><%- version_string %></a>
	<% } else { %>
	<%- version_string %>
	<% } %>
</td>

<td class="notes">
	<%- notes %>
</td>

<% if (showProjects) { %>
<td class="projects"></td>
<% } %>

<td class="date datetime last">
	<%= dateToSortableHTML(model.get('create_date')) %>
</td>

<% if (showDelete) { %>
<td class="delete append">
	<button type="button" class="btn btn-sm"><i class="fa fa-times"></i></button>
</td>
<% } %>
