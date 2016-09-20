<td class="name first">
	<input type="text" class="form-control" name="invitee_name_<%- model.cid %>" 
	<% if (typeof invitee_name !== 'undefined') { %>value="<%- invitee_name %>"<% } %> />
</td>

<% if (config['email_enabled']) { %>
<td class="email last">
	<input type="email" class="form-control" name="invitee_email_<%- model.cid %>"
	<% if (typeof invitee_email !== 'undefined') { %>value="<%- invitee_email %>"<% } %> />
</td>
<% } else { %>
<td class="username last">
	<input type="text" class="form-control" name="invitee_username_<%- model.cid %>"
	<% if (typeof invitee_username !== 'undefined') { %>value="<%- invitee_username %>"<% } %> />
</td>
<% } %>

<% if (showDelete) { %>
<td class="append">
	<button type="button" class="delete btn btn-sm"><i class="fa fa-times"></i></button>
</td>
<% } %>
