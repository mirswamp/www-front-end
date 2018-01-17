<% if (showNumbering) { %>
<td class="prepend number">
	<%- index %>
</td>
<% } %>

<% var i = 0; %>
<% for (var key in data) { %>
<% if (i == 0) { %> 
<td class="first"> 
<% } else if (i == Object.keys(data).length - 1) { %>
<td class="last">
<% } else { %>
<td>
<% } %>
<span>
	<% if (urls[key]) { %>
	<a href="<%= urls[key] %>" target="_blank"><%= data[key] %></a>
	<% } else { %>
	<%= stringToHTML(data[key]) %>
	<% } %>
</span>
</td>
<% i++; %>
<% } %>

