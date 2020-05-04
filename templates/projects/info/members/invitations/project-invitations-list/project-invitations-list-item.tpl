<td class="name">
	<%- invitee_name %>
</td>

<% if (application.config.email_enabled) { %>
<td class="email" style="border-right:none">
	<a href="mailto:<%- invitee_email %>"><%= invitee_email %></a>
</td>
<% } else { %>
<td class="username" style="border-right:none">
	<%= invitee_username %>
</td>
<% } %>

<td class="date hidden-xs" style="border-right:none">
	<%= dateToSortableHTML(create_date) %>
</td>

<td class="status">
	<%- status.toTitleCase() %>
</td>

<% if (showDelete) { %>
<td class="delete">
	<% if (isPending) { %>
	<button type="button" class="btn btn-sm"><i class="fa fa-times"></i></button>
	<% } %>
</td>
<% } %>