<% if (showNumbering) { %>
<td class="prepend number">
	<%- index %>
</td>
<% } %>

<td class="prepend select-group">
	<div data-toggle="popover" title="Select Group" data-content="Click to select or deselect all items in group." data-placement="top">
		<input type="checkbox" name="select-group">
	</div>
</td>

<% var invalid = (package_name == '?' || (package_version_string == '?') || (tool_name == '?') || (tool_version_string == '?') || (platform_name == '?') || (platform_version_string == '?')); %>
<td class="prepend select">
	<% if (!invalid || showDelete) { %>
	<input type="checkbox" name="select" />
	<% } %>
</td>

<td class="package first">
	<div class="name">
		<% if (packageUrl) { %>
		<a href="<%- packageUrl %>" target="_blank"><%= textToHtml(package_name) %></a>
		<% } else { %>
		<%= textToHtml(package_name) %>
		<% } %>
	</div>

	<div class="version">
		<% if (packageVersionUrl) { %>
		<a href="<%- packageVersionUrl %>" target="_blank"><%= textToHtml(package_version_string) %></a>
		<% } else { %>
		<%= textToHtml(package_version_string) %>
		<% } %>
	</div>
</td>

<td class="tool">
	<div class="name">
		<% if (toolUrl) { %>
		<a href="<%- toolUrl %>" target="_blank"><%= textToHtml(tool_name) %></a>
		<% } else { %>
		<%= textToHtml(tool_name) %>
		<% } %>
	</div>

	<div class="version">
		<% if (toolVersionUrl) { %>
		<a href="<%- toolVersionUrl %>" target="_blank"><%= textToHtml(tool_version_string) %></a>
		<% } else { %>
		<%= textToHtml(tool_version_string) %>
		<% } %>
	</div>
</td>

<td class="platform">
	<div class="name">
		<% if (platformUrl) { %>
		<a href="<%- platformUrl %>" target="_blank"><%= textToHtml(platform_name) %></a>
		<% } else { %>
		<%= textToHtml(platform_name) %>
		<% } %>
	</div>

	<div class="version">
		<% if (platformVersionUrl) { %>
		<a href="<%- platformVersionUrl %>" target="_blank"><%= textToHtml(platform_version_string) %></a>
		<% } else { %>
		<%= textToHtml(platform_version_string) %>
		<% } %>
	</div>
</td>

<% if (showProjects) { %>
<td class="project">
	<div class="project">
		<% if (projectUrl) { %>
		<a href="<%- projectUrl %>" target="_blank"><%= textToHtml(project_name) %></a>
		<% } else { %>
		<%= textToHtml(project_name) %>
		<% } %>
	</div>
</td>
<% } %>

<td class="results last" style="text-align:center;font-weight:normal">
	<% if (num_execution_records > 0) { %>
	<div class="active badge-group" data-toggle="tooltip" data-content="Click to view results of assessment runs using this assessment." data-placement="top" data-container="body">
		<span class="badge"><%- num_execution_records %></span>
	</div>
	<% } else { %>
	<div class="active badge-group" data-toggle="tooltip" data-content="Click to view results of assessment runs using this assessment." data-placement="top" data-container="body">
		<span class="badge badge-important"><%- num_execution_records %></span>
	</div>
	<% } %>
</td>

<td class="append delete hidden-xs">
	<% if (showDelete) { %>
	<button type="button" class="btn btn-sm"><i class="fa fa-times"></i></button>
	<% } %>
</td>
