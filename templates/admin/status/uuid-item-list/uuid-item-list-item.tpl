<% if (showNumbering) { %>
<td class="prepend number">
	<%- index %>
</td>
<% } %>

<% for (var i=0; i < fieldnames.length; i++) { %>
<% if (i == 0) { %> 
<td class="first"> 
<% } else if (i == fieldnames.length - 1) { %>
<td class="last">
<% } else { %>
<td>
<% } %>
<span>
	<% var key = fieldnames[i]; %>
	<% if (urls[key]) { %>
	<a href="<%= urls[key] %>" target="_blank"><%= data[key] %></a>
	<% } else if (typeof data[key] == 'string') { %>
	<%= textToHtml(data[key]) %>
	<% } else { %>
	<%= data[key] %>
	<% } %>
</span>
</td>
<% } %>

