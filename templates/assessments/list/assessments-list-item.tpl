<% if (showNumbering) { %>
<td class="prepend number">
	<%- index %>
</td>
<% } %>

<td class="package first">
	<div class="name">
		<% if (packageUrl) { %>
		<a href="<%- packageUrl %>"><%= textToHtml(package_name) %></a>
		<% } else { %>
		<%= textToHtml(package_name) %>
		<% } %>
	</div>

	<div class="version">
		<% if (packageVersionUrl) { %>
		<a href="<%- packageVersionUrl %>"><%= textToHtml(package_version_string) %></a>
		<% } else { %>
		<%= textToHtml(package_version_string) %>
		<% } %>
	</div>
</td>

<td class="tool">
	<div class="name">
		<% if (toolUrl) { %>
		<a href="<%- toolUrl %>"><%= textToHtml(tool_name) %></a>
		<% } else { %>
		<%= textToHtml(tool_name) %>
		<% } %>
	</div>

	<div class="version">
		<% if (toolVersionUrl) { %>
		<a href="<%- toolVersionUrl %>"><%= textToHtml(tool_version_string) %></a>
		<% } else { %>
		<%= textToHtml(tool_version_string) %>
		<% } %>
	</div>
</td>

<td class="platform">
	<div class="name">
		<% if (platformUrl) { %>
		<a href="<%- platformUrl %>"><%= textToHtml(platform_name) %></a>
		<% } else { %>
		<%= textToHtml(platform_name) %>
		<% } %>
	</div>

	<div class="version">
		<% if (platformVersionUrl) { %>
		<a href="<%- platformVersionUrl %>"><%= textToHtml(platform_version_string) %></a>
		<% } else { %>
		<%= textToHtml(platform_version_string) %>
		<% } %>
	</div>
</td>

<td class="results last" style="text-align:center;font-weight:normal">
	<% if (num_execution_records > 0) { %>
	<div class="badge-group" data-toggle="tooltip" data-content="Click to view results of assessment runs." data-placement="top" data-container="body">
		<span class="badge"><%- num_execution_records %></span>
	</div>
	<% } else { %>
	<div class="badge-group" data-toggle="tooltip" data-content="Click to view results of assessment runs." data-placement="top" data-container="body">
		<span class="badge badge-important"><%- num_execution_records %></span>
	</div>
	<% } %>
</td>

<% if (showDelete) { %>
<td class="append delete hidden-xs">
	<button type="button" class="btn btn-sm"><i class="fa fa-times"></i></button>
</td>
<% } %>
