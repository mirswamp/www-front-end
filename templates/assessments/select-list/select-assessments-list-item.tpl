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
		<a href="<%- packageUrl %>"><%= stringToHTML(package_name) %></a>
		<% } else { %>
		<%= stringToHTML(package_name) %>
		<% } %>
	</div>

	<div class="version">
		<% if (packageVersionUrl) { %>
		<a href="<%- packageVersionUrl %>"><%= stringToHTML(package_version_string) %></a>
		<% } else { %>
		<%= stringToHTML(package_version_string) %>
		<% } %>
	</div>
</td>

<td class="tool">
	<div class="name">
		<% if (toolUrl) { %>
		<a href="<%- toolUrl %>"><%= stringToHTML(tool_name) %></a>
		<% } else { %>
		<%= stringToHTML(tool_name) %>
		<% } %>
	</div>

	<div class="version">
		<% if (toolVersionUrl) { %>
		<a href="<%- toolVersionUrl %>"><%= stringToHTML(tool_version_string) %></a>
		<% } else { %>
		<%= stringToHTML(tool_version_string) %>
		<% } %>
	</div>
</td>

<td class="platform">
	<div class="name">
		<% if (platformUrl) { %>
		<a href="<%- platformUrl %>"><%= stringToHTML(platform_name) %></a>
		<% } else { %>
		<%= stringToHTML(platform_name) %>
		<% } %>
	</div>

	<div class="version">
		<% if (platformVersionUrl) { %>
		<a href="<%- platformVersionUrl %>"><%= stringToHTML(platform_version_string) %></a>
		<% } else { %>
		<%= stringToHTML(platform_version_string) %>
		<% } %>
	</div>
</td>

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
