<td class="password-label">
	<% if (readOnly) { %>

	<% if (label) { %>
	<%= label %>
	<% } else { %>
	<b>none</b>
	<% } %>

	<% } else { %>

	<a>
	<% if (label) { %>
	<%= label %>
	<% } else { %>
	<b>none</b>
	<% } %>
	</a>

	<% } %>
</td>

<td class="date">
	<%= dateToSortableHTML(create_date) %>
</td>

<% if (showDelete) { %>
<td class="delete">
	<button type="button" class="btn btn-sm"><i class="fa fa-times"></i></button>
</td>
<% } %>
