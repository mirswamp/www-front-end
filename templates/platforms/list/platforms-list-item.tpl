<td class="name">
	<% if (url) { %>
	<a href="<%= url %>"><%= textToHtml(name) %></a>
	<% } else { %>
	<%= textToHtml(name) %>
	<% } %>
</td>

<td class="description">
	<%= description %>
</td>

<td class="versions">
	<ul>
	<% for (var i = 0; i < version_strings.length; i++) { %>
		<li><%- version_strings[i] %></li>
	<% } %>
	</ul>
</td>