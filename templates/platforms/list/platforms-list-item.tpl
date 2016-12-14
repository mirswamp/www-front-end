<% if (showNumbering) { %>
<td class="prepend number">
	<%- index %>
</td>
<% } %>

<td class="name first">
	<% if (user) { %>
	<a href="#platforms/<%- model.get('platform_uuid') %>"><%= stringToHTML(model.get('name')) %></a>
	<% } else { %>
	<%= stringToHTML(model.get('name')) %>
	<% } %>
</td>

<td class="description">
	<%- model.get('description') %>
</td>

<td class="versions last">
	<ul>
	<% var versionStrings = model.get('version_strings'); %>
	<% for (var i = 0; i < versionStrings.length; i++) { %>
		<li><%- versionStrings[i] %></li>
	<% } %>
	</ul>
</td>
