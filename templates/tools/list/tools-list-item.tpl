<td class="name">
	<% if (url) { %>
	<a href="<%- url %>"><%= textToHtml(name) %></a>
	<% } else { %>
	<%= textToHtml(name) %>
	<% } %>
</td>

<td class="package-types">
	<ul>
	<% for (var i = 0; i < package_type_names.length; i++) { %>
		<li><%- package_type_names[i] %></li>
	<% } %>
	</ul>
</td>

<td class="description hidden-xs">
	<%= description %>
</td>

<td class="versions hidden-sm">
	<ul>
	<% for (var i = 0; i < version_strings.length; i++) { %>
		<li><%- version_strings[i] %></li>
	<% } %>
	</ul>
</td>

<% if (showDelete) { %>
<td class="delete">
	<% if (isOwned) { %>
	<button type="button" class="btn btn-sm"><i class="fa fa-times"></i></button>
	<% } %>
</td>
<% } %>