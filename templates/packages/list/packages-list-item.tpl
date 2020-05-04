<td class="package">
	<% if (url) { %>
	<a href="<%= url %>"><%= textToHtml(name) %></a>
	<% } else { %>
	<%= textToHtml(name) %>
	<% } %>
</td>

<td class="description hidden-xs">
	<%- description %>
</td>

<% if (showProjects) { %>
<td class="projects"></td>
<% } %>

<td class="package-type">
	<%- package_type %>
</td>

<td class="versions">
	<ul>
	<% for (var i = 0; i < version_strings.length; i++) { %>
		<li><%- version_strings[i] %></li>
	<% } %>
	</ul>
	<% if (num_versions == version_strings.length + 1) { %>
	and 1 other
	<% } else if (num_versions > version_strings.length) { %>
	and <%= num_versions - version_strings.length %> others
	<% } %>
</td>

<% if (showDelete) { %>
<td class="delete">
	<% if (isOwned) { %>
	<button type="button" class="btn btn-sm"><i class="fa fa-times"></i></button>
	<% } %>
</td>
<% } %>
