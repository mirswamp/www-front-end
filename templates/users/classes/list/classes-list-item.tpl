<td class="class first">
	<%= class_code %>
</td>

<td class="create-date last">
	<%= dateToSortableHTML(create_date) %>
</td>

<% if (showDelete) { %>
<td class="delete append">
	<button type="button" class="btn btn-sm"><i class="fa fa-times"></i></button>
</td>
<% } %>
