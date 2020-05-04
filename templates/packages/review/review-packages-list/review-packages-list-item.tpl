<td class="package">
	<a href="<%= url %>" target="_blank"><%= textToHtml(name) %></a>
</td>

<td class="type">
	<%= typeName %>
</td>

<td class="date datetime">
	<%= dateToSortableHTML(create_date) %>
</td>

<% if (showDelete) { %>
<td class="delete">
	<% if (!isDeactivated) { %>
	<button type="button" class="btn btn-sm"><i class="fa fa-close"></i></button>
	<% } %>
</td>
<% } %>