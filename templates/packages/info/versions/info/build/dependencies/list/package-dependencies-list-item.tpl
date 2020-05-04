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
	<span class="dependency-list"><%= textToHtml(dependencyList) %></span>
</td>