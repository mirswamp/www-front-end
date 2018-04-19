<td class="password-label first">
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

<td class="create-date last">
	<%= dateToSortableHTML(create_date) %>
</td>

<% if (showDelete) { %>
<td class="delete append">
	<button type="button" class="btn btn-sm"><i class="fa fa-times"></i></button>
</td>
<% } %>
