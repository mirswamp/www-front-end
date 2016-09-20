<% if (!model.isDeactivated() || showDeactivatedPackages) { %>

<% if (showNumbering) { %>
<td class="prepend number">
	<%- index %>
</td>
<% } %>

<td class="name first">
	<% if (url) { %>
	<a href="<%- url %>"><%= stringToHTML(model.get('name')) %></a>
	<% } else { %>
	<%= stringToHTML(model.get('name')) %>
	<% } %>
</td>

<td class="package-types">
	<ul>
	<% var packageTypeNames = model.get('package_type_names'); %>
	<% for (var i = 0; i < packageTypeNames.length; i++) { %>
		<li><%- packageTypeNames[i] %></li>
	<% } %>
	</ul>
</td>

<td class="description hidden-xs">
	<%= model.get('description') %>
</td>

<td class="versions hidden-sm last">
	<ul>
	<% var versionStrings = model.get('version_strings'); %>
	<% for (var i = 0; i < versionStrings.length; i++) { %>
		<li><%- versionStrings[i] %></li>
	<% } %>
	</ul>
</td>

<% if (showDelete) { %>
<td class="append">
	<% if (model.isOwned()) { %>
	<button type="button" class="delete btn btn-sm"><i class="fa fa-times"></i></button>
	<% } %>
</td>
<% } %>

<% } %>
