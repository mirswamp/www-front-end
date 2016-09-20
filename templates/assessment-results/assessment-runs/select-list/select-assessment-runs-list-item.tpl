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
	<% if (packageUrl) { %>
	<a href="<%- packageUrl %>"><span class="name"><%= stringToHTML(package.name) %></span></a>
	<% } else { %>
	<span class="name"><%= stringToHTML(package.name) %></span>
	<% } %>
	<% if (packageVersionUrl) { %>
	<a href="<%- packageVersionUrl %>"><span class="version label"><%= stringToHTML(package.version_string) %></span></a>
	<% } else { %>
	<span class="version label"><%= stringToHTML(package.version_string) %></span>
	<% } %>
</td>

<td class="tool">
	<% if (toolUrl) { %>
	<a href="<%- toolUrl %>"><span class="name"><%= stringToHTML(tool.name) %></span></a>
	<% } else { %>
	<span class="name"><%= stringToHTML(tool.name) %></span>
	<% } %>
	<% if (toolVersionUrl) { %>
	<a href="<%- toolVersionUrl %>"><span class="version label"><%= stringToHTML(tool.version_string) %></span></a>
	<% } else { %>
	<span class="version label"><%= stringToHTML(tool.version_string) %></span>
	<% } %>
</td>

<td class="platform">
	<% if (platformUrl) { %>
	<a href="<%- platformUrl %>"><span class="name"><%= stringToHTML(platform.name) %></span></a>
	<% } else { %>
	<span class="name"><%= stringToHTML(platform.name) %></span>
	<% } %>
	<% if (platformVersionUrl) { %>
	<a href="<%- platformVersionUrl %>"><span class="version label"><%= stringToHTML(platform.version_string) %></span></a>
	<% } else { %>
	<span class="version label"><%= stringToHTML(platform.version_string) %></span>
	<% } %>
</td>

<td class="datetime hidden-xs<% if (!showStatus) { %> last<% } %>">
<%= dateToSortableHTML(model.get('create_date')) %>
</td>

<% if (showStatus) { %>
<td class="status last">
	<a href="<%- runUrl %>"><%- model.get('status').toLowerCase() %></a>

	<% if (showErrors) { %>
	<% if (model.hasErrors() && errorUrl) { %>
	<a id="errors" class="btn btn-sm" target="_blank" data-content="View errors" data-container="body" href="<%- errorUrl %>">
		<i class="fa fa-exclamation" style="margin:4px"></i>
	</a>
	<% } %>
	<% } %>

	<% if (!model.hasErrors() && model.hasResults()) { %>
	<br />

	<div class="badge-group">
	<% if (weakness_cnt > 0) { %>
	<i class="fa fa-bug"></i> <span class="badge"><%- weakness_cnt %></span>
	<% } else { %>
	<% if (weakness_cnt == 0) { %>
	<i class="fa fa-bug"></i> <span class="badge badge-important">0</span>
	<% } %>
	<% } %>
	</div>
	
	<% } %>
</td>
<% } %>

<% if (showDelete) { %>
<td class="append delete hidden-xs">
	<button type="button" class="delete btn btn-sm"><i class="fa fa-times"></i></button>
</td>
<% } %>

<td class="append ssh hidden-xs"<% if (!showSsh) { %> display: none; <% } %>">
	<% if (showSsh) { %>
		<button class="btn ssh">SSH</button>
	<% } %>
</td>

