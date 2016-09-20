<% if (showNumbering) { %>
<td class="prepend number">
	<%- index %>
</td>
<% } %>

<td class="package first">
	<a href="<%- packageUrl %>"><span class="name"><%= stringToHTML(package_name) %></span></a>
	<% if (packageVersionUrl) { %>
	<a href="<%- packageVersionUrl %>"><span class="version"><%= stringToHTML(package_version_string) %></span></a>
	<% } else { %>
	<span class="version"><%= stringToHTML(package_version_string) %></span>
	<% } %>
</td>

<td class="tool">
	<a href="<%- toolUrl %>"><span class="name"><%= stringToHTML(tool_name) %></span></a>
	<% if (toolVersionUrl) { %>
	<a href="<%- toolVersionUrl %>"><span class="version"><%= stringToHTML(tool_version_string) %></span></a>
	<% } else { %>
	<span class="version"><%= stringToHTML(tool_version_string) %></span>
	<% } %>
</td>

<td class="platform">
	<a href="<%- platformUrl %>"><span class="name"><%= stringToHTML(platform_name) %></span></a>
	<% if (platformVersionUrl) { %>
	<a href="<%- platformVersionUrl %>"><span class="version"><%= stringToHTML(platform_version_string) %></span></a>
	<% } else { %>
	<span class="version"><%= stringToHTML(platform_version_string) %></span>
	<% } %>
</td>

<td class="results last">
	<button type="button" class="btn btn-sm"><i class="fa fa-bug"></i></button>
</td>

<% if (showDelete) { %>
<td class="append delete hidden-xs">
	<button type="button" class="delete btn btn-sm"><i class="fa fa-times"></i></button>
</td>
<% } %>
