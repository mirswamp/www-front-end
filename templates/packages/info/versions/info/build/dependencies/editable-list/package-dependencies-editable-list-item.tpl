<td class="platform description">
	<% if (platformUrl) { %>
	<a href="<%- platformUrl %>"><span class="name"><%= textToHtml(platformVersionName) %></span></a>
	<% } else { %>
	<span class="name"><%= textToHtml(platformVersionName) %></span>
	<% } %>

	<% if (platformVersionUrl) { %>
	<a href="<%- platformVersionUrl %>"><span class="version"><%= textToHtml(platformVersionString) %></span></a>
	<% } else { %>
	<span class="version"><%= textToHtml(platformVersionString) %></span>
	<% } %>
</td>

<td class="dependency-list">
	<div class="input-group">
		<input type="text" class="form-control" value="<%= dependencyList %>" />
		<div class="input-group-addon">
			<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Package Dependencies" data-content="This is a space separated list of packages that this package is dependent upon for a particular platform."></i>
		</div>
	</div>
</td>

<% if (showDelete) { %>
<td class="delete">
	<button type="button" class="btn btn-sm"><i class="fa fa-times"></i></button>
</td>
<% } %>