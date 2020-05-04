<td class="class">
	<% if (typeof class_code !== 'undefined') { %>
	<%= class_code %>
	<% } %>
</td>

<td class="date">
	<% if (typeof create_date !== 'undefined') { %>
	<%= dateToSortableHTML(create_date) %>
	<% } %>
</td>

<% if (showDelete) { %>
<td class="delete">
	<button type="button" class="btn btn-sm"><i class="fa fa-times"></i></button>
</td>
<% } %>
