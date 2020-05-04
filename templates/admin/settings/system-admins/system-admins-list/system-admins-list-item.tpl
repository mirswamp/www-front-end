<td class="user">
	<% if (url) { %>
		<a href="<%= url %>" target="_blank"><%= name %></a>
	<% } else { %>
		<%= name %>
	<% } %>
</td>
 
<% if (application.config.email_enabled) { %>
<td class="email">
	<a href="mailto:<%- email %>"><%= email %></a>
</td>
<% } else { %>
<td class="username">
	<%= username %>
</td>
<% } %>

<% if (showDelete) { %>
<td class="delete">
	<button type="button" class="btn btn-sm"><i class="fa fa-times"></i></button>
</td>
<% } %>
				