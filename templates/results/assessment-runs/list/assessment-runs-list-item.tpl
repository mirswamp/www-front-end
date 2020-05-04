<td class="package">
	<div class="name">
		<% if (packageUrl) { %>
		<a href="<%- packageUrl %>" target="_blank"><%= textToHtml(package.name) %></a>
		<% } else { %>
		<%= textToHtml(package.name) %>
		<% } %>
	</div>

	<div class="version">
		<% if (packageVersionUrl) { %>
		<a href="<%- packageVersionUrl %>" target="_blank"><%= textToHtml(package.version_string) %></a>
		<% } else { %>
		<%= textToHtml(package.version_string) %>
		<% } %>
	</div>
</td>

<td class="tool">
	<div class="name">
		<% if (toolUrl) { %>
		<a href="<%- toolUrl %>" target="_blank"><%= textToHtml(tool.name) %></a>
		<% } else { %>
		<%= textToHtml(tool.name) %>
		<% } %>
	</div>

	<div class="version">
		<% if (toolVersionUrl) { %>
		<a href="<%- toolVersionUrl %>" target="_blank"><%= textToHtml(tool.version_string) %></a>
		<% } else { %>
		<%= textToHtml(tool.version_string) %>
		<% } %>
	</div>
</td>

<td class="platform">
	<div class="name">
		<% if (platformUrl) { %>
		<a href="<%- platformUrl %>" target="_blank"><%= textToHtml(platform.name) %></a>
		<% } else { %>
		<%= textToHtml(platform.name) %>
		<% } %>
	</div>

	<div class="version">
		<% if (platformVersionUrl) { %>
		<a href="<%- platformVersionUrl %>" target="_blank"><%= textToHtml(platform.version_string) %></a>
		<% } else { %>
		<%= textToHtml(platform.version_string) %>
		<% } %>
	</div>
</td>

<% if (showProjects) { %>
<td class="project">
	<div class="name">
		<% if (projectUrl) { %>
		<a href="<%- projectUrl %>" target="_blank"><%= textToHtml(project.name) %></a>
		<% } else { %>
		<%= textToHtml(project.name) %>
		<% } %>
	</div>
</td>
<% } %>

<td class="date hidden-xs<% if (!showStatus) { %> last<% } %>">
	<%= dateToSortableHTML(create_date) %>
</td>

<% if (showStatus) { %>
<td class="status">
	<a href="<%- runUrl %>" target="_blank"><%- status.toLowerCase() %></a>
</td>
<% } %>

<td class="results">
	<% if (isComplete) { %>

	<% if (showErrors && hasErrors && errorUrl) { %>
	<a id="errors" class="warning btn btn-sm" data-toggle="tooltip" data-content="Click to view error report" data-placement="top" href="<%- errorUrl %>" target="_blank">
		<i class="warning fa fa-exclamation" style="margin:4px"></i>Error
	</a>
	<% } %>

	<% if (!hasErrors && hasResults) { %>
	<div class="badge-group">
		<% if (resultsUrl) { %>
		<a class="scarf-results" href="<%= resultsUrl %>" target="_blank" data-toggle="tooltip" data-content="Click to download results in SCARF format." data-placement="top">
		<% } %>

		<% if (weakness_cnt > 0) { %>
		<div class="icon"><i class="fa fa-bug"></i></div>
		<div class="badge"><%- weakness_cnt.toLocaleString() %></div>
		<% } else if (weakness_cnt == 0) { %>
		<div class="icon"><i class="fa fa-bug"></i></div>
		<div class="badge badge-important">0</div>
		<% } %>

		<% if (resultsUrl) { %>
		</a>
		<% } %>
	</div>
	<% } %>

	<% } %>

	<% if (showSsh) { %>
	<button class="ssh btn btn-sm"<% if (!sshEnabled) {%> style="display:none"<% } %>>SSH</button>
	<% } %>
</td>

<% if (showDelete) { %>
<td class="delete hidden-xs">
	<button type="button" class="btn btn-sm"><i class="fa fa-times"></i></button>
</td>
<% } %>