<td class="version-string">
	<% if (typeof url !== 'undefined') { %>
	<a href="<%- url %>"><%- version_string %></a>
	<% } else { %>
	<%- version_string %>
	<% } %>
</td>

<td class="notes">
	<% if (typeof notes !== 'undefined') { %>
	<%- notes %>
	<% } %>
</td>

<td class="date datetime">
	<%= dateToSortableHTML(create_date) %>
</td>

<% if (showDelete) { %>
<td class="delete">
	<button type="button" class="btn btn-sm"><i class="fa fa-times"></i></button>
</td>
<% } %>
