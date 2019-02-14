<% if (!model.isDeactivated() || showDeactivatedPackages) { %>

<% if (showNumbering) { %>
<td class="prepend number">
	<%- index %>
</td>
<% } %>

<td class="package">
	<% if (url) { %>
	<a href="<%- url %>"><%= stringToHTML(model.get('name')) %></a>
	<% } else { %>
	<%= stringToHTML(model.get('name')) %>
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

<td class="versions last">
	<ul>
	<% var versionStrings = model.get('version_strings'); %>
	<% for (var i = 0; i < versionStrings.length; i++) { %>
		<li><%- versionStrings[i] %></li>
	<% } %>
	</ul>
	<% if (num_versions == model.get('version_strings').length + 1) { %>
	and 1 other
	<% } else if (num_versions > model.get('version_strings').length) { %>
	and <%= num_versions - model.get('version_strings').length %> others
	<% } %>
</td>

<% if (showDelete) { %>
<td class="delete append">
	<% if (model.isOwned()) { %>
	<button type="button" class="btn btn-sm"><i class="fa fa-times"></i></button>
	<% } %>
</td>
<% } %>

<% } %>
