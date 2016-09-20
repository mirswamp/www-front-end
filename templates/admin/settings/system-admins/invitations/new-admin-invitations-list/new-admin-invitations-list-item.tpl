<td class="name first">
	<input type="text" class="required form-control" value="<%- model.get('invitee_name') %>" />
</td>

<% if (config['email_enabled']) { %>
<td class="email last">
	<input type="text" class="required form-control" value="<%- model.get('email') %>" />
</td>
<% } else { %>
<td class="username last">
	<input type="text" class="required form-control" value="<%- model.get('username') %>" />
</td>
<% } %>

<% if (showDelete) { %>
<td class="append">
	<button type="button" class="delete btn btn-sm"><i class="fa fa-times"></i></button>
</td>
<% } %>
				