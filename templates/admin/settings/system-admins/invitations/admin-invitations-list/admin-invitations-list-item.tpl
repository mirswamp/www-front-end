<td class="name">
	<% if (invitee_url) { %>
		<a href="<%= invitee_url %>" target="_blank"><%- invitee_name %></a>
	<% } else { %>
		<%- invitee_name %>
	<% } %>
</td>

<td class="inviter" style="border-right:none">
	<% if (inviter_url) { %>
		<a href="<%= inviter_url %>" target="_blank"><%= inviter_name %></a>
	<% } else { %>
		<%= inviter_name %>
	<% } %>
</td>

<td class="date datetime" style="border-right:none">
	<% if (typeof create_date !== 'undefined') { %>
	<%= dateToSortableHTML(create_date) %>
	<% } %>
</td>

<td class="status">
	<%- status %>
</td>

<% if (showDelete) { %>
<td class="delete">
	<% if (isPending) { %>
	<button type="button" class="btn btn-sm"><i class="fa fa-times"></i></button>
	<% } %>
</td>
<% } %>