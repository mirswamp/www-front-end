<% if (showNumbering) { %>
<td class="prepend number">
	<%- index %>
</td>
<% } %>

<td class="user first">
	<%- model.getFullName() %>
</td>

<% if (showEmail) { %>
<td class="email">
	<a href="mailto:<%- model.get('email') %>"><%= emailToHTML(model.get('email')) %></a>
</td>
<% } %>

<% if (showUsername) { %>
<td class="username">
	<%= model.get('username') %>
</td>
<% } %>

<td class="affiliation hidden-xs">
	<%- model.get('affiliation') %>
</td>

<td class="join-date hidden-xs datetime">
	<%/* projectMembership is for the current row, while currentProjectMembership is for the current user. */%>
	<% if (projectMembership.hasCreateDate()) { %>
	<%= dateToSortableHTML(projectMembership.getCreateDate()) %>
	<% } %>
</td>

<td class="admin last">
	<% if (projectMembership && projectMembership.isAdmin()) { %>
	<input type="checkbox" checked <% if (readOnly) { %> disabled="disabled" <% } %> />
	<% } else {  %>
	<input type="checkbox" <% if (readOnly) { %> disabled="disabled" <% } %> />
	<% } %>
</td>

<% if (showDelete) { %>
<td class="append">
	<button type="button" class="delete btn btn-sm"><i class="fa fa-times"></i></button>
</td>
<% } %>
