<td class="package">
	<% if (packageUrl) { %>
	<a href="<%- packageUrl %>" target="_blank"><span class="name"><%= textToHtml(package_name) %></span></a>
	<% } else { %>
	<%= textToHtml(package_name) %>
	<% } %>

	<% if (packageVersionUrl) { %>
	<a href="<%- packageVersionUrl %>" target="_blank"><span class="version"><%= textToHtml(package_version_string) %></span></a>
	<% } else { %>
	<span class="version"><%= textToHtml(package_version_string) %></span>
	<% } %>
</td>

<td class="tool">
	<% if (toolUrl) { %>
	<a href="<%- toolUrl %>" target="_blank"><span class="name"><%= textToHtml(tool_name) %></span></a>
	<% } else { %>
	<%= textToHtml(tool_name) %>
	<% } %>

	<% if (toolVersionUrl) { %>
	<a href="<%- toolVersionUrl %>" target="_blank"><span class="version"><%= textToHtml(tool_version_string) %></span></a>
	<% } else { %>
	<span class="version"><%= textToHtml(tool_version_string) %></span>
	<% } %>
</td>

<td class="platform<% if (!showSchedule && !showProjects) { %> last<% } %>">
	<% if (platformUrl) { %>
	<a href="<%- platformUrl %>" target="_blank"><span class="name"><%= textToHtml(platform_name) %></span></a>
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
	<a href="<%- projectUrl %>" target="_blank"><span class="name"><%= textToHtml(project_name) %></span></a>
	<% } else { %>
	<%= textToHtml(project_name) %>
	<% } %>
</td>
<% } %>

<% if (showSchedule) { %>
<td class="schedule">
	<span data-toggle="tooltip" data-placement="bottom" data-original-title="<%- runRequest.get('description') %>">
		<% if (runRequestUrl) { %>
		<a href="<%- runRequestUrl %>" target="_blank"><%= textToHtml(runRequest.get('name')) %></a>
		<% } else { %>
 		<%= textToHtml(runRequest.get('name')) %>
		<% } %>
	</span>
</td>
<% } %>

<% if (showDelete) { %>
<td class="delete">
	<button type="button" class="btn btn-sm"><i class="fa fa-times"></i></button>
</td>
<% } %>