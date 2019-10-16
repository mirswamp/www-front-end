<% if (showNumbering) { %>
<td class="prepend number">
	<%- index %>
</td>
<% } %>

<% if (false) { %>
<td class="package first">
	<% if (package) { %>
	<% if (package_url) { %>
	<a href="<%- package_url %>"><%= textToHtml(package.get('name')) %></a>
	<% } else { %>
	<%= textToHtml(package.get('name')) %>
	<% } %>
	<% } %>
</td>
<% } %>

<td class="platform">
	<% if (platform) { %>
	<% if (platform_url) { %>
	<a href="<%- platform_url %>"><%= textToHtml(platform.get('name')) %></a>
	<% } else { %>
	<%= textToHtml(platform.get('name')) %>
	<% } %>
	<% } %>
</td>

<td class="platform-version">
	<% if (platform_version) { %>
	<% if (platform_version_url) { %>
	<a href="<%- platform_version_url %>"><%= textToHtml(platform_version.get('version_string')) %></a>
	<% } else { %>
	<%= textToHtml(platform_version.get('version_string')) %>
	<% } %>
	<% } %>
</td>

<td class="compatible last">
	<%= compatible_flag? 'yes' : 'no' %>
</td>

<% if (showDelete) { %>
<td class="delete append">
	<% if (model.isOwned()) { %>
	<button type="button" class="btn btn-sm"><i class="fa fa-times"></i></button>
	<% } %>
</td>
<% } %>
