<% if (showNumbering) { %>
<td class="prepend number">
	<%- index %>
</td>
<% } %>

<td class="name first">
	<a href="<%= url %>"><%= name %></a>
</td>

<% if (showUnfinished) { %>
<td class="unfinished <% if (!showPrivate) { %> last<% } %>">
	<span class="warning">&#x2713;</span>
</td>
<% } %>

<% if (showPrivate) { %>
<td class="private last">
<% if (editable) { %>
	<input type="checkbox" class="private" <% if (private) {%>checked<% } %>>
<% } else { %>
<% if (private) { %>
	<span class="success">&#x2713;</span>
<% } %>
<% } %>
</td>
<% } %>


