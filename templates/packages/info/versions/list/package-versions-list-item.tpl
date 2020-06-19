<td class="version-string">
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

<td class="date datetime">
	<% if (typeof create_date !== 'undefined') { %>
	<%= dateToSortableHTML(create_date) %>
	<% } %>
</td>

<% if (showDelete) { %>
<td class="delete">
	<button type="button" class="btn btn-sm"><i class="fa fa-times"></i></button>
</td>
<% } %>