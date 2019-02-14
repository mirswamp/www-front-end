<% if (showNumbering) { %>
<td class="prepend number">
	<%- index %>
</td>
<% } %>

<td class="package first>
	<% if (packageUrl) { %>
	<a href="<%- packageUrl %>"><span class="name"><%= stringToHTML(package_name) %></span></a>
	<% } else { %>
	<%= stringToHTML(package_name) %>
	<% } %>

	<% if (packageVersionUrl) { %>
	<a href="<%- packageVersionUrl %>"><span class="version"><%= stringToHTML(package_version_string) %></span></a>
	<% } else { %>
	<span class="version"><%= stringToHTML(package_version_string) %></span>
	<% } %>
</td>

<td class="tool">
	<% if (toolUrl) { %>
	<a href="<%- toolUrl %>"><span class="name"><%= stringToHTML(tool_name) %></span></a>
	<% } else { %>
	<%= stringToHTML(tool_name) %>
	<% } %>

	<% if (toolVersionUrl) { %>
	<a href="<%- toolVersionUrl %>"><span class="version"><%= stringToHTML(tool_version_string) %></span></a>
	<% } else { %>
	<span class="version"><%= stringToHTML(tool_version_string) %></span>
	<% } %>
</td>

<td class="platform<% if (!showSchedule && !showProjects) { %> last<% } %>">
	<% if (platformUrl) { %>
	<a href="<%- platformUrl %>"><span class="name"><%= stringToHTML(platform_name) %></span></a>
	<% } else { %>
	<%= stringToHTML(platform_name) %>
	<% } %>

	<% if (platformVersionUrl) { %>
	<a href="<%- platformVersionUrl %>"><span class="version"><%= stringToHTML(platform_version_string) %></span></a>
	<% } else { %>
	<span class="version"><%= stringToHTML(platform_version_string) %></span>
	<% } %>
</td>

<% if (showProjects) { %>
<td class="project<% if (!showSchedule) { %> last<% } %>">
	<% if (projectUrl) { %>
	<a href="<%- projectUrl %>"><span class="name"><%= stringToHTML(project_name) %></span></a>
	<% } else { %>
	<%= stringToHTML(project_name) %>
	<% } %>
</td>
<% } %>

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
<td class="delete append">
	<button type="button" class="btn btn-sm"><i class="fa fa-times"></i></button>
</td>
<% } %>
