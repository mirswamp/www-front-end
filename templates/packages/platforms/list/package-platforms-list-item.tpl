<% if (false) { %>
<td class="package">
	<% if (package_name) { %>
	<% if (package_url) { %>
	<a href="<%- package_url %>"><%= textToHtml(package_name) %></a>
	<% } else { %>
	<%= textToHtml(package_name) %>
	<% } %>
	<% } %>
</td>
<% } %>

<td class="platform">
	<% if (platform) { %>
	<% if (platform_url) { %>
	<a href="<%- platform_url %>"><%= textToHtml(platform_name) %></a>
	<% } else { %>
	<%= textToHtml(platform_name) %>
	<% } %>
	<% } %>
</td>

<td class="platform-version">
	<% if (platform_version) { %>
	<% if (platform_version_url) { %>
	<a href="<%- platform_version_url %>"><%= textToHtml(platform_version_string) %></a>
	<% } else { %>
	<%= textToHtml(platform_version_string) %>
	<% } %>
	<% } %>
</td>

<td class="compatible">
	<%= compatible_flag? 'yes' : 'no' %>
</td>

<% if (showDelete) { %>
<td class="delete">
	<button type="button" class="btn btn-sm"><i class="fa fa-times"></i></button>
</td>
<% } %>