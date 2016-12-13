<td class="name first">
	<%- model.get('invitee_name') %>
</td>

<% if (config['email_enabled']) { %>
<td class="email" style="border-right:none">
	<a href="mailto:<%- model.get('invitee_email') %>"><%= emailToHTML(model.get('invitee_email')) %></a>
</td>
<% } else { %>
<td class="username" style="border-right:none">
	<%= model.get('invitee_username') %>
</td>
<% } %>

<td class="date hidden-xs" style="border-right:none">
	<% if (model.hasCreateDate()) { %>
	<%= dateToSortableHTML( model.getCreateDate() ) %>
	<% } %>
</td>

<td class="status last">
	<%- model.getStatus().toTitleCase() %>
</td>

<% if (showDelete) { %>
<td class="delete append">
	<% if (model.isPending()) { %>
	<button type="button" class="btn btn-sm"><i class="fa fa-times"></i></button>
	<% } %>
</td>
<% } %>