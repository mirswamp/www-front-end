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

<td class="prepend select">
	<% if (showSelect) { %>
	<div <% if (!isSelectable) {%> data-toggle="popover" title="Incompatible" data-content="This result is incompatible with the selected viewer."<% } %>>
	<input type="checkbox" name="select"<% if (isChecked && isSelectable) { %> checked <% } %><% if (!isSelectable) {%> class="unselectable" disabled<% } %>>
	</div>
	<% } %>
</td>

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
<td class="status">
	<a href="<%- runUrl %>"><%- model.get('status').toLowerCase() %></a>
</td>
<% } %>

<td class="results last">

	<% if (showErrors) { %>
	<% if (model.hasErrors() && errorUrl) { %>
	<a id="errors" class="warning btn btn-sm" target="_blank" data-toggle="tooltip" data-content="Click to view error report" data-placement="top" href="<%- errorUrl %>">
		<i class="warning fa fa-exclamation" style="margin:4px"></i>Error
	</a>
	<% } %>
	<% } %>

	<% if (!model.hasErrors() && model.hasResults()) { %>

	<div class="badge-group">
		<% if (resultsUrl) { %>
		<a href="<%= resultsUrl %>" target="_blank" data-toggle="tooltip" data-content="Click to download results in SCARF format." data-placement="top">
		<% } %>

		<% if (weakness_cnt > 0) { %>
		<div class="icon"><i class="fa fa-bug"></i></div>
		<div class="badge"><%- weakness_cnt %></div>
		<% } else { %>
		<% if (weakness_cnt == 0) { %>
		<div class="icon"><i class="fa fa-bug"></i></div>
		<div class="badge badge-important">0</div>
		<% } %>
		<% } %>

		<% if (resultsUrl) { %>
		</a>
		<% } %>
	</div>
	
	<% } %>

	<% if (showSsh) { %>
	<button class="ssh btn btn-sm"<% if (!sshEnabled) {%> style="display:none"<% } %>>SSH</button>
	<% } %>
</td>

<% if (showDelete) { %>
<td class="append delete hidden-xs">
	<button type="button" class="btn btn-sm"><i class="fa fa-times"></i></button>
</td>
<% } %>