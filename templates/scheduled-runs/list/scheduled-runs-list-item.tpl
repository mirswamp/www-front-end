<% if (showNumbering) { %>
<td class="prepend number">
	<%- index %>
</td>
<% } %>

<td class="package first>
	<% if (packageUrl) { %>
	<a href="<%- packageUrl %>"><span class="name"><%= textToHtml(package_name) %></span></a>
	<% } else { %>
	<%= textToHtml(package_name) %>
	<% } %>

	<% if (packageVersionUrl) { %>
	<a href="<%- packageVersionUrl %>"><span class="version"><%= textToHtml(package_version_string) %></span></a>
	<% } else { %>
	<span class="version"><%= textToHtml(package_version_string) %></span>
	<% } %>
</td>

<td class="tool">
	<% if (toolUrl) { %>
	<a href="<%- toolUrl %>"><span class="name"><%= textToHtml(tool_name) %></span></a>
	<% } else { %>
	<%= textToHtml(tool_name) %>
	<% } %>

	<% if (toolVersionUrl) { %>
	<a href="<%- toolVersionUrl %>"><span class="version"><%= textToHtml(tool_version_string) %></span></a>
	<% } else { %>
	<span class="version"><%= textToHtml(tool_version_string) %></span>
	<% } %>
</td>

<td class="platform<% if (!showSchedule && !showProjects) { %> last<% } %>">
	<% if (platformUrl) { %>
	<a href="<%- platformUrl %>"><span class="name"><%= textToHtml(platform_name) %></span></a>
	<% } else { %>
	<%= textToHtml(platform_name) %>
	<% } %>

	<% if (platformVersionUrl) { %>
	<a href="<%- platformVersionUrl %>"><span class="version"><%= textToHtml(platform_version_string) %></span></a>
	<% } else { %>
	<span class="version"><%= textToHtml(platform_version_string) %></span>
	<% } %>
</td>

<% if (showProjects) { %>
<td class="project<% if (!showSchedule) { %> last<% } %>">
	<% if (projectUrl) { %>
	<a href="<%- projectUrl %>"><span class="name"><%= textToHtml(project_name) %></span></a>
	<% } else { %>
	<%= textToHtml(project_name) %>
	<% } %>
</td>
<% } %>

<% if (showSchedule) { %>
<td class="schedule last">
	<span data-toggle="tooltip" data-placement="bottom" data-original-title="<%- runRequest.get('description') %>">
		<% if (runRequestUrl) { %>
		<a href="<%- runRequestUrl %>"><%= textToHtml(runRequest.get('name')) %></a>
		<% } else { %>
 		<%= textToHtml(runRequest.get('name')) %>
		<% } %>
	</span>
</td>
<% } %>

<% if (showDelete) { %>
<td class="delete append">
	<button type="button" class="btn btn-sm"><i class="fa fa-times"></i></button>
</td>
<% } %>
