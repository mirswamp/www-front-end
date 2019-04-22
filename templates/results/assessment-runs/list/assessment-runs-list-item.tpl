<% if (showNumbering) { %>
<td class="prepend number">
	<%- index %>
</td>
<% } %>

<td class="package first">
	<div class="name">
		<% if (packageUrl) { %>
		<a href="<%- packageUrl %>"><%= stringToHTML(package.name) %></a>
		<% } else { %>
		<%= stringToHTML(package.name) %>
		<% } %>
	</div>

	<div class="version">
		<% if (packageVersionUrl) { %>
		<a href="<%- packageVersionUrl %>"><%= stringToHTML(package.version_string) %></a>
		<% } else { %>
		<%= stringToHTML(package.version_string) %>
		<% } %>
	</div>
</td>

<td class="tool">
	<div class="name">
		<% if (toolUrl) { %>
		<a href="<%- toolUrl %>"><%= stringToHTML(tool.name) %></a>
		<% } else { %>
		<%= stringToHTML(tool.name) %>
		<% } %>
	</div>

	
	<div class="version">
		<% if (toolVersionUrl) { %>
		<a href="<%- toolVersionUrl %>"><%= stringToHTML(tool.version_string) %></a>
		<% } else { %>
		<%= stringToHTML(tool.version_string) %>
		<% } %>
	</div>
</td>

<td class="platform">
	<div class="name">
		<% if (platformUrl) { %>
		<a href="<%- platformUrl %>"><%= stringToHTML(platform.name) %></a>
		<% } else { %>
		<%= stringToHTML(platform.name) %>
		<% } %>
	</div>

	<div class="version">
		<% if (platformVersionUrl) { %>
		<a href="<%- platformVersionUrl %>"><%= stringToHTML(platform.version_string) %></a>
		<% } else { %>
		<%= stringToHTML(platform.version_string) %>
		<% } %>
	</div>
</td>

<td class="datetime hidden-xs<% if (!showStatus) { %> last<% } %>">
<%= dateToSortableHTML(model.get('create_date')) %>
</td>

<% if (showStatus) { %>
<td class="status last">
	<a href="<%- runUrl %>"><%- model.get('status').toLowerCase() %></a>
</td>
<% } %>

<td class="results last">

	<% if (showErrors && model.hasErrors() && errorUrl) { %>
	<a id="errors" class="warning btn btn-sm" target="_blank" data-toggle="tooltip" data-content="Click to view error report" data-placement="top" href="<%- errorUrl %>">
		<i class="warning fa fa-exclamation" style="margin:4px"></i>Error
	</a>
	<% } %>

	<% if (!model.hasErrors() && model.hasResults()) { %>
	<div class="badge-group">
		<% if (weakness_cnt > 0) { %>
		<i class="fa fa-bug"></i> <span class="badge"><%- weakness_cnt.toLocaleString() %></span>
		<% } else if (weakness_cnt == 0) { %>
		<i class="fa fa-bug"></i> <span class="badge badge-important">0</span>
		<% } %>
	</div>
	<% } %>

	<% if (showSsh) { %>
	<button class="ssh btn btn-sm" style="margin-top:5px"<% if (!sshEnabled) {%> style="display:none"<% } %>>SSH</button>
	<% } %>
</td>

<% if (showDelete) { %>
<td class="append delete hidden-xs">
	<button type="button" class="btn btn-sm"><i class="fa fa-times"></i></button>
</td>
<% } %>
