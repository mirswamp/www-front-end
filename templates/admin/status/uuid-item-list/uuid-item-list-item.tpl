<% for (var i=0; i < fieldnames.length; i++) { %>
<td>
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