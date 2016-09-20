<% if (showNumbering) { %>
<td class="prepend number">
	<%- index %>
</td>
<% } %>

<td class="platform description first">
	<% if (platformUrl) { %>
	<a href="<%- platformUrl %>"><span class="name"><%= stringToHTML(platformVersionName) %></span></a>
	<% } else { %>
	<span class="name"><%= stringToHTML(platformVersionName) %></span>
	<% } %>
	
	<% if (platformVersionUrl) { %>
	<a href="<%- platformVersionUrl %>"><span class="version"><%= stringToHTML(platformVersionString) %></span></a>
	<% } else { %>
	<span class="version"><%= stringToHTML(platformVersionString) %></span>
	<% } %>
</td>

<td class="dependency-list last">
	<span class="dependency-list"><%= stringToHTML(dependencyList) %></span>
</td>
