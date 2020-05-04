<td class="name">
	<input type="text" class="required form-control" value="<%- invitee_name %>" />
</td>

<% if (application.config.email_enabled) { %>
<td class="email">
	<input type="text" class="required form-control" value="<%- typeof email !== 'undefined'? email : null %>" />
</td>
<% } else { %>
<td class="username">
	<input type="text" class="required form-control" value="<%- username %>" />
</td>
<% } %>

<% if (showDelete) { %>
<td class="delete">
	<button type="button" class="btn btn-sm"><i class="fa fa-times"></i></button>
</td>
<% } %>
				