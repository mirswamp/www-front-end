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

<td class="platform<% if (!showSchedule) { %> last<% } %>">
	<a href="<%- platformUrl %>"><span class="name"><%= stringToHTML(platform_name) %></span></a>
	<% if (platformVersionUrl) { %>
	<a href="<%- platformVersionUrl %>"><span class="version"><%= stringToHTML(platform_version_string) %></span></a>
	<% } else { %>
	<span class="version"><%= stringToHTML(platform_version_string) %></span>
	<% } %>
</td>

<% if (showSchedule) { %>
<td class="schedule last">
	<span data-toggle="tooltip" data-placement="bottom" data-original-title="<%- runRequest.get('description') %>">
		<% if (runRequestUrl) { %>
		<a href="<%- runRequestUrl %>"><%= stringToHTML(runRequest.get('name')) %></a>
		<% } else { %>
 		<%= stringToHTML(runRequest.get('name')) %>
		<% } %>
	</span>
</td>
<% } %>

<% if (showDelete) { %>
<td class="append">
	<button type="button" class="delete btn btn-sm"><i class="fa fa-times"></i></button>
</td>
<% } %>
