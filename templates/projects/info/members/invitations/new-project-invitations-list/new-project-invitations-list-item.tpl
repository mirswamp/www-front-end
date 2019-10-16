<form>
	<td class="name first">
		<div class="form-group">
			<input type="text" class="form-control" name="invitee_name_<%- model.cid %>" 
			<% if (typeof invitee_name !== 'undefined') { %>value="<%- invitee_name %>"<% } %> />
		</div>
	</td>

	<% if (config['email_enabled']) { %>
	<td class="email last">
		<div class="form-group">
			<input type="email" class="form-control" name="invitee_email_<%- model.cid %>"
			<% if (typeof invitee_email !== 'undefined') { %>value="<%- invitee_email %>"<% } %> />
		</div>
	</td>
	<% } else { %>
	<td class="username last">
		<div class="form-group">
			<input type="text" class="form-control" name="invitee_username_<%- model.cid %>"
			<% if (typeof invitee_username !== 'undefined') { %>value="<%- invitee_username %>"<% } %> />
		</div>
	</td>
	<% } %>

	<% if (showDelete) { %>
	<td class="delete append">
		<button type="button" class="btn btn-sm"><i class="fa fa-times"></i></button>
	</td>
	<% } %>
</form>
