<td class="user">
	<%- user.getFullName() %>
</td>

<% if (showEmail) { %>
<td class="email">
	<a href="mailto:<%- user.get('email') %>"><%= user.get('email') %></a>
</td>
<% } %>

<% if (showUsername) { %>
<td class="username">
	<%= user.get('username') %>
</td>
<% } %>

<td class="affiliation hidden-xs">
	<%- user.get('affiliation') %>
</td>

<td class="join-date hidden-xs datetime">
	<%/* projectMembership is for the current row, while currentProjectMembership is for the current user. */%>
	<% if (create_date) { %>
	<%= dateToSortableHTML(create_date) %>
	<% } %>
</td>

<td class="admin">
	<% if (admin_flag) { %>
	<input type="checkbox" checked <% if (readOnly) { %> disabled="disabled" <% } %> />
	<% } else {  %>
	<input type="checkbox" <% if (readOnly) { %> disabled="disabled" <% } %> />
	<% } %>
</td>

<% if (showDelete) { %>
<td class="delete">
	<button type="button" class="btn btn-sm"><i class="fa fa-times"></i></button>
</td>
<% } %>